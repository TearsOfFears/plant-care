import * as React from 'react'
import type {Socket,} from 'socket.io-client'
import io from 'socket.io-client'

export const useSocket = () => {
    const socketRef = React.useRef<Socket | null>(null,)

    React.useEffect(() => {
        socketRef.current = io('ws://localhost:5000')

        return () => {
            socketRef.current?.disconnect()
        }
    }, [],)

    return socketRef.current;
}