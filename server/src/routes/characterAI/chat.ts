import { Request, Response, NextFunction } from 'express';
import { CACHE_CHAT, cache } from '../../utils/cache';

import * as OpenAI from 'openai'
import { CreateChatCompletionRequest } from 'openai';

const chat = async (req: Request, res: Response, next: NextFunction) => {
    const openai = new OpenAI.OpenAIApi(
        new OpenAI.Configuration({
            apiKey: '<openai_api_key>',
        })
    )
    let messages: CreateChatCompletionRequest['messages'] = cache.get(CACHE_CHAT);
    messages = messages.concat({ role: 'user', content: req.body.question });
    console.log(messages);

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
    })
    console.log(response.data, response.data.choices)
    cache.set(CACHE_CHAT, messages);
    res.send({content: response.data.choices[0].message});
};

export default chat;