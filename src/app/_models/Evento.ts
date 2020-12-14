import { Lote } from "./Lote";
import { Palestrante } from "./Palestrante";
import { RedeSocial } from "./RedeSocial";

export interface Evento {

    eventoId: number ;
    local: string; 
    dataEvento : Date;
    tema: string; 
    qtdPessoas: number; 
    lote: Lote[]; 
    redeSocial: RedeSocial[]; 
    palestranteEventos: Palestrante[]; 
    imagemUrl: string; 
}
