import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserQueries } from '../../services/user.queries';
import { UserService } from '../../services/user.service';

class UserRegistrationFormModel {
  username = "";
  password = "";
  confirmPassword = "";
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild("f")
  form: NgForm;

  model = new UserRegistrationFormModel();

  constructor(
    private router: Router,
    private userService: UserService,
    private userQueries: UserQueries,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  async submit() {
    // TODO  Vérifier que la confirmation de mot de passe correspond au mot de passe
    if (this.form.form.invalid || this.model.password !== this.model.confirmPassword) {
      return;
    }

    let exists = await this.userQueries.exists(this.model.username);

    console.log(exists);

    if (exists) {
      //Notif que l'username existe deja
      this.nzMessageService.error("Username déjà existant.");
    } else {
      this.userService.register(this.model.username, this.model.password);
      this.goToLogin();
    }

  }

  goToLogin() {
    // TODO rediriger l'utilisateur sur "/splash/login DONE"
    this.router.navigate(['/splash/login']);
  }
}
