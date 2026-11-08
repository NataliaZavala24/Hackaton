export class Transaccion {

    static historial = [];

    constructor(id, descripcion, monto, fecha, tipo, categoria) {

        this.id = id;
        this.fecha = fecha;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.monto = monto;
        this.categoria = categoria;
    }
}
    

