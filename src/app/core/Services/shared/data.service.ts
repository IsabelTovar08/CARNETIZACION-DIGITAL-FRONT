import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { PersonCreate, PersonList } from '../../Models/security/person.models';
import { UserCreate, UserList } from '../../Models/security/user.models';
import { Role } from '../../Models/security/role.models';
import { Module } from '../../Models/security/module.models';
import { Form } from '@angular/forms';
import { Permission } from '../../Models/security/permission.models';
import { FromModel } from '../../Models/security/form.models';
import { RolFormPermissionsCreate, RolFormPermissionsList } from '../../Models/security/rol-form-permission.models';
import { RolFormPermissionService } from '../api/rol-form-permission/rol-form-permission.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private personService: ApiService<PersonCreate, PersonList>,
    private userService: ApiService<UserCreate, UserList>,
    private roleService: ApiService<Role, Role>,
    private moduleService: ApiService<Module, Module>,
    private formService: ApiService<FromModel, FromModel>,
    private permissionService: ApiService<Permission, Permission>,
    private rfpermissionService: RolFormPermissionService


  ) { }

  // --- Datos dinámicos ---
  private personasSubject = new BehaviorSubject<PersonList[]>([]);
  personas$ = this.personasSubject.asObservable();

  private usuariosSubject = new BehaviorSubject<UserList[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();

  private rolesSubject = new BehaviorSubject<Role[]>([]);
  roles$ = this.rolesSubject.asObservable();

  private modulesSubject = new BehaviorSubject<Module[]>([]);
  modules$ = this.modulesSubject.asObservable();

  private formsSubject = new BehaviorSubject<FromModel[]>([]);
  forms$ = this.formsSubject.asObservable();

  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private roleFormPermissionsSubject = new BehaviorSubject<RolFormPermissionsList[]>([]);
  roleFormPermissions$ = this.roleFormPermissionsSubject.asObservable();

  getPeople() {
    this.personService.ObtenerTodo('Person')
      .subscribe(data => this.personasSubject.next(data.data));
  }

  getUsers() {
    this.userService.ObtenerTodo('User')
      .subscribe(data => this.usuariosSubject.next(data.data));
  }

  getRoles() {
   this.roleService.ObtenerTodo('Rol')
      .subscribe(data => this.rolesSubject.next(data.data));
  }

  getModules() {
   this.moduleService.ObtenerTodo('Module')
      .subscribe(data => this.modulesSubject.next(data.data));
  }

  getForms() {
   this.formService.ObtenerTodo('Form')
      .subscribe(data => this.formsSubject.next(data.data));
  }

  getPermissions() {
   this.permissionService.ObtenerTodo('Permission')
      .subscribe(data => this.permissionsSubject.next(data.data));
  }

  getRoleFormPermissions() {
   this.rfpermissionService.getAllPermissions()
      .subscribe(data => this.roleFormPermissionsSubject.next(data.data));
  }
}
