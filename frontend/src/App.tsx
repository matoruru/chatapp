import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import io from 'socket.io-client'
import { z } from 'zod';
import './App.css';

const socket = io()

const ChatForm = z.object({
  name: z.string(),
  message: z.string(),
})
type ChatFormType = z.infer<typeof ChatForm>

const App = () => {
  const [ token, setToken ] = useState('')
  const { register, handleSubmit, reset } = useForm<ChatFormType>();
  const [ messages, setMessages ] = useState<(ChatFormType & { token: string, date: string })[]>([])

  const onSubmit = (data: ChatFormType) => {
    console.log('Message sent')
    socket.emit("sendMessage", JSON.stringify({ token, ...data }))
    reset({ message: '' })
  };

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages([ ...messages, JSON.parse(message) ])
      console.log(messages)
      console.log('Message from server: ', message)
    })
    socket.on("token", (message) => {
      setToken(message.token)
    })
  }, [ messages ])

  const buildMessages = () => {
    return messages.map((m) => {
      return m.token === token ?
        <p className="message myself" key={m.date}>{m.message}</p> :
        <p className="message" key={m.date}>{m.name}: {m.message}</p>
    })
  }

  return (
    <div className='App'>
      <>
        { buildMessages() }
      </>
      <form className='inputFields' onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="名前" {...register("name")} />
        <textarea placeholder="メッセージを入力" {...register("message")} />
        <div className='buttonWrapper'>
          <input type="submit" value="送信" />
        </div>
      </form>
    </div>
  );
}

export default App;
