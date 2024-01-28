import { Socket } from 'socket.io';
import socketIO from 'socket.io';

const historialMensajes: any[] = [];

export const desconectar = ( cliente: Socket ) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    })
}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        console.log( 'Mensaje recibido', payload );
        historialMensajes.push(payload);        
        io.emit('mensaje-nuevo', payload );        
    })

    cliente.on("historial-mensajes", () => {      
      console.log("Historial de mensajes", historialMensajes);
      io.emit("historial-mensajes", historialMensajes);
    });

    
}