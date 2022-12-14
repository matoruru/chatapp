import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import io from 'socket.io-client'
import { z } from 'zod';
import './App.css';

const socket = io()

const ChatForm = z.object({
  name: z.string(),
  message: z.string(),
})
type ChatForm = z.infer<typeof ChatForm>

const App = () => {
  const [ token, setToken ] = useState('')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChatForm>();
  const [ messages, setMessages ] = useState<(ChatForm & { token: string, date: string })[]>([])

  const onSubmit = (data: ChatForm) => {
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
        <input type="text" placeholder="name" {...register("name")} />
        <textarea placeholder="message" {...register("message")} />
        <div className='buttonWrapper'>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
}

export default App;
