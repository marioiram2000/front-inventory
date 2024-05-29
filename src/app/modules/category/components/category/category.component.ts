import { Component, OnInit, ViewChild } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/modules/shared/components/confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isAdmin: boolean = false;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.utilService.getRoles();
    this.isAdmin = this.utilService.isAdmin();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.processCategoriesResponse(data);
      },
      (error: any) => {
        console.log('ERROR: ', error);
      }
    );
  }

  processCategoriesResponse(response: any) {
    const dataCategory: CategoryElement[] = [];
    if (response.metadata[0].code == '00') {
      let categories = response.categoryResponse.category;
      categories.forEach((categoria: CategoryElement) => {
        dataCategory.push(categoria);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Categoría agregada', 'Éxito');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar('Se ha producido un error', 'Error');
      }
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, { duration: 2000 });
  }

  edit(category: CategoryElement) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Categoría actualizada', 'Éxito');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar('Se ha producido un error', 'Error');
      }
    });
  }

  delete(category: CategoryElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(category.id).subscribe(
          (result) => {
            console.log(result);
            this.openSnackBar('Categoría eliminada', 'Éxito');
            this.getCategories();
          },
          (error: any) => {
            this.openSnackBar('Se ha producido un error', 'Error');
          }
        );
      }
    });
  }

  buscar(id: string) {
    if (id.length === 0) {
      this.getCategories();
    } else {
      this.categoryService.getCategoryById(id).subscribe((result) => {
        this.processCategoriesResponse(result);
      });
    }
  }

  exportToExcel() {
    this.categoryService.exportCategoriesToExcel().subscribe(
      (result: any) => {
        let file = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement('a');
        anchor.download = 'categories.xlsx';
        anchor.href = fileUrl;
        anchor.click();
        this.openSnackBar('Archivo exportado', 'Exito');
      },
      (error: any) => {
        this.openSnackBar('Archivo No exportado', 'Error');
      }
    );
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
