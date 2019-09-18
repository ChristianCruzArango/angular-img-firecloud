import { Directive,EventEmitter,ElementRef,HostListener,Input,Output } from '@angular/core';
import { FileItem } from '../models/file-item';


@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos:FileItem [] = [];
  @Output() mouseSobre:EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  /*cuando el mouse entra en el elemento */
  @HostListener('dragover',['$event'])
  public OnDragEnter(event:any){
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  /*cuando el mouse se vaya del elemento */
  @HostListener('dragleave',['$event'])
  public onDragLeave(event:any){
    this.mouseSobre.emit(false);
  }

  /* cuando se suelta el mouse */
  @HostListener('drop',['$event'])
  public onDrop(event:any){

    const transferencia = this._getTransferencia(event);

    if(!transferencia){
      return;
    }

    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);
  }

  /*sirve para la compatibilidad entre los navegadores */
  private _getTransferencia(event:any){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  /*sirve para extraer el archivo que se subio */
  private _extraerArchivos(archivosLista:FileList){
    // console.log(archivosLista);
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {

      const archivoTemporal = archivosLista[propiedad];

      if(this._archivoPuedeSerCargado(archivoTemporal)){

        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }

    }
    console.log(this.archivos);
  }


  /* esta validacion evita que al momento de cargar una iamgen se abra en otra pestana en el navegador */
  private _prevenirDetener(event){
    event.preventDefault();
    event.stopPropagation();
  }

  /*validar si el archivo que voy a subir existe o no en el arreglo de archivos */
  private _archivoYaFueSubido(nombreArchivo:string):boolean{
    for (const archivo of this.archivos) {
       if(archivo.nombreArchivo == nombreArchivo) {
         console.log('El archivo' + nombreArchivo + 'ya existe');
         return true;
       }
    }
    return false;
  }

  /*verificar si son imagenes */
  private _esImagen(tipoArchivo:string):boolean{
    return (tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

  /*combinacion de ambas */
  private _archivoPuedeSerCargado(archivo:File):boolean{
    if(!this._archivoYaFueSubido(archivo.name) && this._esImagen(archivo.type)){
      return true;
    }else{
      return false;
    }
  }
}
