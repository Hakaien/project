import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isPasswordSet: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin: string | null;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  
  createUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error || 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.createUserForm.reset();
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onCreateUser(): void {
    if (this.createUserForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.adminService.createUser(this.createUserForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Utilisateur créé avec succès ! Un email d\'invitation a été envoyé.';
          this.createUserForm.reset();
          this.showCreateForm = false;
          this.loadUsers(); // Recharger la liste
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error || 'Erreur lors de la création de l\'utilisateur';
          this.isLoading = false;
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`)) {
      this.isLoading = true;
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur supprimé avec succès';
          this.loadUsers(); // Recharger la liste
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error || 'Erreur lors de la suppression de l\'utilisateur';
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  getStatusBadgeClass(user: User): string {
    if (!user.isPasswordSet) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (!user.isVerified) {
      return 'bg-orange-100 text-orange-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }

  getStatusText(user: User): string {
    if (!user.isPasswordSet) {
      return 'En attente de mot de passe';
    } else if (!user.isVerified) {
      return 'En attente de vérification';
    } else {
      return 'Actif';
    }
  }
}
