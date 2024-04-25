import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { NewProductComponent } from '../new-product/new-product.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'quantity',
    'category',
    'picture',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProductElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isAdmin: boolean = false;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.utilService.getRoles();
    this.isAdmin = this.utilService.isAdmin();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (response) => {
        this.processProductResponse(response);
      },
      (error: any) => {
        console.log('Error en productos:', error);
      }
    );
  }

  processProductResponse(resp: any) {
    const dateProduct: ProductElement[] = [];
    if (resp.metadata[0].code == '00') {
      console.log(resp);

      let listCProduct = resp.product.product;
      listCProduct.forEach((product: ProductElement) => {
        product.category = product.category;
        product.picture = 'data:image/jpeg;base64,' + product.picture;
        dateProduct.push(product);
      });
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Producto agregado', 'Éxito');
        this.getProducts();
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

  edit(element: any) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Producto actualizado', 'Éxito');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se ha producido un error', 'Error');
      }
    });
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(element.id).subscribe(
          (result) => {
            console.log(result);
            this.openSnackBar('Categoría eliminada', 'Éxito');
            this.getProducts();
          },
          (error: any) => {
            this.openSnackBar('Se ha producido un error', 'Error');
          }
        );
      }
    });
  }

  buscar(str: string) {
    if (str.length === 0) {
      return this.getProducts();
    }
    this.productService.getProductsByName(str).subscribe((response) => {
      this.processProductResponse(response);
    });
  }
}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  picture: any;
}
