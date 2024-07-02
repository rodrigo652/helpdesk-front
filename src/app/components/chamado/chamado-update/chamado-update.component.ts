import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent {

  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacao: '',
    tecnico: '', 
    cliente: '',
    nomeCliente: '',
    nomeTecnico: ''
  }

  clientes: Cliente[] = []
  tecnicos: Tecnico[] = []
  
  prioridade: FormControl = new FormControl(null, [Validators.required])
  status: FormControl = new FormControl(null, [Validators.required])
  titulo: FormControl = new FormControl(null, [Validators.required])
  observacao: FormControl = new FormControl(null, [Validators.required])
  tecnico: FormControl = new FormControl(null, [Validators.required])
  cliente: FormControl = new FormControl(null, [Validators.required])

  
  constructor(
    private chamadoService: ChamadoService, 
    private clienteService: ClienteService, 
    private tecnicoService: TecnicoService, 
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute

  ) {} 

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findById();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe(resposta => {
      this.chamado = resposta;

    }, ex => {
      this.toastService.error(ex.error.error)
    })
  }

  update(): void {
    this.chamadoService.update(this.chamado).subscribe({
      next: (resposta) => {
        this.toastService.success('Chamado criado com sucesso', 'Atualizar chamado');
        this.router.navigate(['chamados']);
      },
      error: (ex) => {
        console.log(ex);
        if (ex.error.errors) {
          ex.error.errors.forEach((element) => {
            this.toastService.error(element.message);
          });
        } else {
          this.toastService.error(ex.error.message);
        }
      },
    });
  }

  findAllClientes(): void {
    this.clienteService.findAll().subscribe(reposta => {
      this.clientes = reposta;
    })
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    })
  }

  validaCampos(): boolean {
    return this.prioridade.valid && this.status.valid && 
          this.titulo.valid && this.observacao.valid && 
          this.tecnico.valid && this.cliente.valid
  }

  retornaStatus(status: any): string {
    if(status === '0') {
      return 'ABERTO';
    } else if (status === '1'){
      return 'EM ANDAMENTO';
    } else {
      return 'ENCERRADO';
    }
  }
  
  retornaPrioridade(prioridade: any): string {
    if(prioridade === '0') {
      return 'BAIXA';
    } else if (prioridade === '1'){
      return 'MEDIA';
    } else {
      return 'ALTA';
    }
  }



}
