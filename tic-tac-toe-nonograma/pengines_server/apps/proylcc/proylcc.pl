:- module(proylcc,
	[  
		put/8
	]).

:-use_module(library(lists)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% replace(?X, +XIndex, +Y, +Xs, -XsY)
%
% XsY es el resultado de reemplazar la ocurrencia de X en la posición XIndex de Xs por Y.


replace(X, 0, Y, [X|Xs], [Y|Xs]).

replace(X, XIndex, Y, [Xi|Xs], [Xi|XsY]):-
    XIndex > 0,
    XIndexS is XIndex - 1,
    replace(X, XIndexS, Y, Xs, XsY).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% put(+Contenido, +Pos, +PistasFilas, +PistasColumnas, +Grilla, -GrillaRes, -FilaSat, -ColSat).
%

put(Contenido, [RowN, ColN], PistasFilas, PistasColumnas, Grilla, NewGrilla, FilaSat, ColSat):-
	% NewGrilla es el resultado de reemplazar la fila Row en la posición RowN de Grilla
	% (RowN-ésima fila de Grilla), por una fila nueva NewRow.
    
	replace(Row, RowN, NewRow, Grilla, NewGrilla), 
     
	% NewRow es el resultado de reemplazar la celda Cell en la posición ColN de Row por _,
	% siempre y cuando Cell coincida con Contenido (Cell se instancia en la llamada al replace/5).
	% En caso contrario (;)
	% NewRow es el resultado de reemplazar lo que se que haya (_Cell) en la posición ColN de Row por Conenido.	 
	
	(replace(Cell, ColN, _, Row, NewRow),
	Cell == Contenido 
		;
	replace(_Cell, ColN, Contenido, Row, NewRow)),

  verificarFilaSat(NewRow, RowN, PistasFilas, _Pistas, FilaSat),
  verificarColSat(NewGrilla, ColN, PistasColumnas, _Columna, _Pista, ColSat).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


verificarColSat(Grilla, Indice, PistasColumna, Columna , Pistas, ColSat):-
    nth0(Indice,PistasColumna,Pistas), %Guardo en Pista la lista con las pistas.
    getColumna(Indice, Grilla, Columna),
    miPredicadoAux(Pistas, Columna, ColSat).

getColumna(Indice, Matriz, Columna):-
    getColumnaAux(Indice,Matriz,[],Columna).

%CB: No tengo mas filas para recorrer.
getColumnaAux(_,[],In,In).

%CR: Para cada fila agrego el elemento a la lista.
getColumnaAux(Indice,[X|Xs],In,Out):-
    nth0(Indice,X,Elem),
    append(In,[Elem],Aux),
    getColumnaAux(Indice,Xs,Aux,Out).


verificarFilaSat( Fila_A_Comparar_Con_Pistas, Indice, PistasFilas, Pistas,FilaSat):-
    nth0(Indice,PistasFilas,Pistas), %Aca en Pista guardo la lista que tiene las pistas.
    miPredicadoAux(Pistas,Fila_A_Comparar_Con_Pistas,FilaSat). %Unifica el valor 0 o 1 en FilaSat.

miPredicadoAux(Pistas,ListaMovida,1):-verificarPistasEnLista(Pistas,ListaMovida).
miPredicadoAux(_Pistas,_ListaMovida,0).

%verificarPistasEnLista([0], []). este caso no se puede dar ya que no deberia haber pistas con 0, que significa 1,0? o 0,3,0, son equivalentes a poner 1 o 3

verificarPistasEnLista([],[]).

verificarPistasEnLista([],[X|Xs]):-chequearQueNoHayaHashtags([X|Xs]).

verificarPistasEnLista([X|Xs], Lista):-
    X == 0, 
    verificarPistasEnLista(Xs, Lista). 

verificarPistasEnLista([X|Xs],[Y|Ys]):-
    Y=="#",
    chequearCadenaLongitud([Y|Ys],X,ListaMovida),
    verificarPistasEnLista(Xs,ListaMovida).

verificarPistasEnLista([X|Xs],[Y|Ys]):-
    Y\=="#",
    verificarPistasEnLista([X|Xs],Ys).

chequearCadenaLongitud([],0,[]).
chequearCadenaLongitud(Xs,0,Xs):- nth0(0,Xs,Rta), Rta \== "#".
chequearCadenaLongitud([X|Xs],Indice,ListaMovida):-X == "#", IndiceAux is Indice-1,chequearCadenaLongitud(Xs,IndiceAux,ListaMovida).

chequearQueNoHayaHashtags([]).
chequearQueNoHayaHashtags([X|Xs]):- X \== "#", chequearQueNoHayaHashtags(Xs).

%Verifica si la grilla en su estado inicial satisface alguna fila o columna.
chequeoInicial(Grilla,IndiceFila,IndiceColumna, _Fila, PistasFilas, Columna, PistasColumnas, SatisfaceFila,SatisfaceColumna):-
    nth0(IndiceFila,Grilla,Fila_A_Comparar_Con_Pistas),
    verificarFilaSat(Fila_A_Comparar_Con_Pistas,IndiceFila,PistasFilas,_PistasF,SatisfaceFila),
    verificarColSat(Grilla,IndiceColumna, PistasColumnas ,Columna,_PistasC,SatisfaceColumna).

%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.
%%%%Segunda parte del proyecto.

resolverNonograma(LongitudPistas,ColSize,PistasFilas,PistasCol,Respuesta):-
    encontrarLineas(LongitudPistas,PistasFilas,SolucionDeLasFilas),
    combinar(SolucionDeLasFilas,Respuesta),
    chequearColumnas(Respuesta, PistasCol,0,ColSize). 

devolver_listas_de_pista(RowClue,LongitudPista,Lista_con_soluciones):-
    findall(L,(length(L,LongitudPista),generarListas(RowClue,L)),Lista_con_soluciones).

generarPista(0,[],[]).
generarPista(0,[X|Xs],Xs):- X\=="#".
generarPista(N,[X|Xs],Ret):- X="#", N\=0, N2 is N-1, generarPista(N2,Xs,Ret).

generarListas([],[]).
generarListas([],[Y|Ys]):-Y\=="#".
generarListas([X|Xs],[Y|Ys]):- Y="#", (generarPista(X,[Y|Ys],ListaReducida),generarListas(Xs,ListaReducida)).
generarListas([X|Xs],[Y|Ys]):-Y\=="#", generarListas([X|Xs],Ys).

combinar([],[]).
combinar([PrimerFila|SolucionFila],[X|GrillaResuelta]):-
    member(X,PrimerFila),
    combinar(SolucionFila,GrillaResuelta).

chequearColumnas(_GrillaResuelta,_PistasColumna,ActualCol,ColLength):-
    ActualCol == ColLength.
chequearColumnas(GrillaResuelta,PistasColumna,ActualCol,ColLength):-
	getColumna(ActualCol,GrillaResuelta,ColN),
    nth0(ActualCol,PistasColumna,PistasColumnaN),
    miPredicadoAux(PistasColumnaN,ColN,ColSat),
    ColSat==1,
    ActualColAux is ActualCol+1,
    chequearColumnas(GrillaResuelta,PistasColumna,ActualColAux,ColLength).

encontrarLineas(_Longitud,[],[]).
encontrarLineas(Longitud,[PistaLinea|Pista],Solucion):-
    devolver_listas_de_pista(PistaLinea,Longitud,R),
	append([R],LineaResuelta,Solucion),
	encontrarLineas(Longitud,Pista,LineaResuelta).