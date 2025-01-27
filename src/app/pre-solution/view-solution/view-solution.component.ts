import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SolutionData } from '../../interface/soltion-data';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SolutionService } from '../../services/solution.service';

@Component({
  selector: 'app-view-solution',
  standalone: false,
  templateUrl: './view-solution.component.html',
  styleUrl: './view-solution.component.scss',
  providers: [DatePipe]
})
export class ViewSolutionComponent {
  tableLoading: boolean = true;
  totalRecord: number = 0;
  page: number = 1;
  searchTerm: string = '';
  filteredSolutions = [];
  private readonly searchSolution = new Subject<string>(); 
  items: MenuItem[] = [];
  
  constructor(private readonly route: Router, private readonly solService: SolutionService) {}

  ngOnInit(){
    this.searchSolution
          .pipe(
            debounceTime(300), 
            distinctUntilChanged() 
          )
          .subscribe((searchTerm) => {
            this.getTableData(searchTerm, this.page);
          });
  }

  onPage(event: any) {
    this.tableLoading = true;
    this.page = event.first == 0 ? 1 : (event.first / 10) + 1 ;
    this.getTableData(this.searchTerm, this.page);
  }

  filterTable() {
    this.tableLoading = true;
    this.page = 1;
    this.searchSolution.next(this.searchTerm.trim().toLowerCase());
  }

  openSolution(data: SolutionData){
        this.route.navigate(['/pre-solution', data.solution_id]);  
  }

  getTableData(searchTerm: string, page: number) {
    this.solService.getSolution(searchTerm, page, 10).subscribe(
      {
        next: (res) => {
          if (res.is_success) {
            this.filteredSolutions = res.data.solutions;
            this.totalRecord = res.data.total;
            this.tableLoading = false;
          } else {
            this.tableLoading = false;
          }
        },
        error: (err) => {
          this.tableLoading = false;
        }
      }
    );
  }

  onKeyPress(event: KeyboardEvent, row: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.openSolution(row);
    }
}

}
