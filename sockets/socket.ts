import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

const historialMensajes: any[] = [];

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario )
}

export const desconectar = ( cliente: Socket ) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario( cliente.id );
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
    // enviar historial de mensajes
    cliente.on("historial-mensajes", () => {      
      console.log("Historial de mensajes", historialMensajes);
      io.emit("historial-mensajes", historialMensajes);
    });
}

// Escuchar configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: Function ) => {
        console.log( 'Configurando usuario', payload.nombre);
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre )
        callback({
          ok: true,
          mensaje: `Usuario ${payload.nombre}, configurado`,
        });
    })
}