// AI服务工具函数

// 添加类型声明以解决process.env类型问题
declare var process: {
  env: {
    ALIYUN_DASHSCOPE_API_KEY?: string;
    ZHIPUAI_API_KEY?: string;
  }
}

export type TextGenerationParams = {
  prompt: string
  stream?: boolean
}

export type ImageGenerationParams = {
  prompt: string
  style?: string
  size?: string
}

// 智谱AI文本生成服务
export async function generateTextWithZhipuAI(
  params: TextGenerationParams
): Promise<ReadableStream | string> {
  // 检查环境变量是否存在
  if (!process.env.ZHIPUAI_API_KEY) {
    console.warn('ZHIPUAI_API_KEY 环境变量未设置，返回模拟文本内容');
    
    const response = `这是由智谱AI生成的文本内容，基于您的提示："${params.prompt}"。
    
在实际实现中，这将通过流式响应或普通响应返回AI生成的内容。`;
    
    if (params.stream) {
      // 创建模拟流式响应
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunks = response.split(' ');
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk + ' '));
            await new Promise(resolve => setTimeout(resolve, 100)); // 模拟延迟
          }
          controller.close();
        }
      });
      return stream;
    }
    
    return response;
  }
  
  // 在实际实现中，我们会使用如下代码：
  // 这里是占位实现，实际部署时需要替换为真实API调用
  const response = `这是由智谱AI生成的文本内容，基于您的提示："${params.prompt}"。
  
在实际实现中，这将通过流式响应或普通响应返回AI生成的内容。`

  if (params.stream) {
    // 创建模拟流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = response.split(' ')
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk + ' '))
          await new Promise(resolve => setTimeout(resolve, 100)) // 模拟延迟
        }
        controller.close()
      }
    })
    return stream
  }
  
  return response
}

// 阿里云通义万相图像生成服务
export async function generateImageWithTongyiwanxiang(
  params: ImageGenerationParams
): Promise<string> {
  // 检查环境变量是否存在
  if (!process.env.ALIYUN_DASHSCOPE_API_KEY) {
    console.warn('ALIYUN_DASHSCOPE_API_KEY 环境变量未设置，返回模拟图像URL');
    return `https://example.com/generated-image-${Date.now()}.jpg`;
  }

  // 步骤1: 发起创建任务请求
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ALIYUN_DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable'
    },
    body: JSON.stringify({
      model: 'wanxian-v2.2',
      input: {
        prompt: params.prompt
      },
      parameters: {
        size: params.size || '1024*1024',
        n: 1
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const taskId = data.output.task_id;

  // 步骤2: 轮询任务结果
  let result;
  let attempts = 0;
  const maxAttempts = 30; // 最多尝试30次，避免无限循环

  do {
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error('图像生成超时');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒再查询
    
    const resultResponse = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ALIYUN_DASHSCOPE_API_KEY}`
      }
    });

    if (!resultResponse.ok) {
      throw new Error(`HTTP error! status: ${resultResponse.status}`);
    }

    result = await resultResponse.json();
  } while (result.output.task_status === 'PENDING' || result.output.task_status === 'RUNNING');

  // 返回生成的图像URL
  return result.output.results[0].url;
}