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

}
