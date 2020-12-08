import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {

  eventos: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  getEventos(){
    this.http.get('https://localhost:44303/api/values').subscribe(
      eventos => {
        this.eventos = eventos;
        console.log(this.eventos);
      },
      error =>{
        console.log("erro");
      });
  }

}
