import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img'

  constructor(private db: AngularFirestore) { }

  cargarImagenesFirebase(imagenes:FileItem[]){

    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {

      item.estaSubiendo = true;

      if(item.progreso >= 100){
        continue;
      }

      /*para subir la imagen */
      const uploadTask:firebase.storage.UploadTask = storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo} `)
                                                    .put(item.archivo);

     /*ejecutar la tarea para subir imagenes */
    //  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    //   (snapshot:firebase.storage.UploadTaskSnapshot)=>item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
    //   (error) => console.error('Error al subir',error),
    //   ()=>{

    //     console.log('Imagen cargada correctamente');
    //     item.url = uploadTask.snapshot.downloadURL;
    //     item.estaSubiendo = false;

    //     this.guardarImagen({nombre:item.nombreArchivo,url:item.url});
    //   });

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          (error) => console.log('Error al subir', error),
          async () => { // Anadi async
              console.log('Imagen cargada correctamente');
              // item.url = uploadTask.snapshot.downloadURL;
              item.url = await uploadTask.snapshot.ref.getDownloadURL(); // Solucion para enviar a la base de datos
              item.estaSubiendo = false;
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url
              });
          });

    }

  }

  private guardarImagen(imagen:{nombre:string,url:string}){
    this.db.collection(`${this.CARPETA_IMAGENES}`).add(imagen);
  }
}
