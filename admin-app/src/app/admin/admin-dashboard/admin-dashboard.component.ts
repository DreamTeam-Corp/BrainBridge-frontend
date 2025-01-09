import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  classrooms: any[] = [];
  users: any[] = [];
  private authStatusSub: Subscription;
  private classroomsSub: Subscription;
  private usersSub: Subscription;
  selectedTab = 0;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });

    this.usersSub = this.adminService
      .getUsersUpdateListener()
      .subscribe((users) => {
        this.users = users;
      });

    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.selectedTab = parseInt(params['tab']);
      }
    });

    this.loadAll();

    this.classroomsSub = this.adminService
      .getClassroomsUpdateListener()
      .subscribe((classrooms) => {
        this.isLoading = false;
        this.classrooms = classrooms;
      });
  }

  loadAll() {
    this.loadClassrooms();
    this.loadUsers();
  }

  loadClassrooms() {
    this.adminService.getAllClassrooms();
  }

  loadUsers() {
    this.adminService.getAllUsers();
  }

  onDelete(classroomId: string) {
    this.adminService.deleteClassroom(classroomId);
  }

  onDeleteUser(userId: string) {
    this.adminService.deleteUser(userId);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    if (this.classroomsSub) {
      this.classroomsSub.unsubscribe();
    }
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }
}
