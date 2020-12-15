import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Evento} from '../_models/Evento';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseUrl = 'https://localhost:44303/api/evento';

constructor(private http: HttpClient) { }

  getAllEvento(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseUrl);
  }

   getByTemaEvento(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseUrl}/getByTema/${tema}`);
  }

   getEvento(id:number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  postEvento(evento: Evento){
    //console.log(evento);
    return this.http.post('https://localhost:44303/api/evento', evento);
  }

  putEvento(evento: Evento, id: number){
    console.log("Id do evento 121212: " + id);
    return this.http.put(`${this.baseUrl}/${id}`, evento);
  }

  deleteEvento(id: number){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
