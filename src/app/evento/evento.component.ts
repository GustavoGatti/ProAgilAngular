import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_service/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {

  titulo: string = 'Eventos';
  _filtroLista: string = '';
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento;
  dataEvento: string;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem: boolean = false;
  registerForm: FormGroup;
  modoalvar = '';
  temp: number;
  bodyDeletarEvento = '';
  file: File;
  nomeTemp: string;

  constructor(private eventoService: EventoService, private modalService: BsModalService, private fb: FormBuilder
    ,private localeService: BsLocaleService, private toastr: ToastrService) {
      this.localeService.use('pt-br');
     }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }
  
  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        console.log(this.eventos);
        this.eventosFiltrados = this.eventos;
      },
      error =>{
        console.log("erro");
      });
      
  }

  editarEvento(evento: Evento, template: any){
    this.modoalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({},evento);
    this.evento.imagemUrl = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any){
    this.modoalvar = 'post';
    this.openModal(template);
  }


  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.eventoId}`;
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.eventoId).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso');
        }, error => {
          this.toastr.error('Erro ao deletar');
          console.log(error);
        }
    );
  }

/*
Criar uma varial this.dataAtual 
Esse metodo é para recarregar a grid de imagem e forçar o cash do navegador, esta comentado pq estou com um
erro no edit e ta dificultando minha vida, mas é a sessão 10 do curso se full stack
chamar a função antes do post e put do evento
  upload(){
    //adicionar o data atual no src da imagem na frente ? _ts={{dataAtual}}, sim é gambiarra
    if(this.modoalvar === 'post'){
      this.evento.imagemUrl = this.nomeTemp;
      this.eventoService.postUpload(this.file, this.nomeTemp).subscribe(
        ()=>{
          this.dataAtual = new Date().getDate().toString();
          this.getEventos();
        }
      )
    }else{
      this.evento.imagemUrl = this.nomeTemp;
      this.eventoService.postUpload(this.file, this.nomeTemp).subscribe(
        ()=>{
          this.dataAtual = new Date().getDate().toString();
          this.getEventos();
        }
      )
    }
  }
*/
  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  
  onFileChange(event){
    const reader = new FileReader();
    //console.log("Testando: " + event.target.files);
    if(event.target.files){
      this.file = event.target.files;
      this.nomeTemp = this.file[0].name;
      console.log(this.file[0].name);
    }
  
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){
      if(this.modoalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);
        console.log(this.nomeTemp);
        this.eventoService.postUpload(this.file).subscribe(); 
      
        this.evento.imagemUrl = this.nomeTemp;
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso');
          },
          error => {
            console.log(error);
            this.toastr.error('Erro ao inserir');
          });
      }else if(this.modoalvar === 'put'){
      console.log("Id do evento: " + this.evento.eventoId);
        this.temp = this.evento.eventoId;
        console.log("Temp: " + this.temp);
      
        this.evento = Object.assign({id: this.evento.eventoId}, this.registerForm.value);
        this.eventoService.postUpload(this.file).subscribe(); 
        this.evento.imagemUrl = this.nomeTemp;
        console.log("Id do evento: " + this.evento.eventoId);
        this.eventoService.putEvento(this.evento, this.temp).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso');
          },
          error => {
            console.log(error);
            this.toastr.error('Erro ao Editar');
          });
      }
      
    }
  }

  validation(){
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      imagemURL: ['', Validators.required],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }



}
