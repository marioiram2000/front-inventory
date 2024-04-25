import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryElement } from '../../category/components/category/category.component';
import { NewCategoryComponent } from '../../category/components/new-category/new-category.component';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { ProductElement } from '../product/product.component';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  public productForm!: FormGroup;
  editando: boolean = false;
  categories: CategoryElement[] = [];
  selectedFile: any;
  imageName: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public product: ProductElement
  ) {}

  ngOnInit(): void {
    if (this.product != null) {
      this.editando = true;
      this.productForm = this.fb.group({
        name: [this.product.name, Validators.required],
        price: [this.product.price, Validators.required],
        quantity: [this.product.quantity, Validators.required],
        category: [this.product.category.id, Validators.required],
        picture: ['', Validators.required],
      });
    } else {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        quantity: ['', Validators.required],
        category: ['', Validators.required],
        picture: ['', Validators.required],
      });
    }

    this.categoryService.getCategories().subscribe(
      (data: any) => {
        this.categories = data.categoryResponse.category;
      },
      (error: any) => {
        console.log('ERROR: ', error);
      }
    );
  }

  onSave() {
    const uploadImageData = new FormData();
    uploadImageData.append('name', this.productForm.get('name')?.value);
    uploadImageData.append('price', this.productForm.get('price')?.value);
    uploadImageData.append('quantity', this.productForm.get('quantity')?.value);
    uploadImageData.append(
      'categoryId',
      this.productForm.get('category')?.value
    );
    uploadImageData.append(
      'picture',
      this.selectedFile,
      this.selectedFile.name
    );

    if (this.product != null) {
      this.productService
        .updateProduct(uploadImageData, this.product?.id)
        .subscribe(
          (response) => {
            this.dialogRef.close(1);
          },
          (error: any) => {
            this.dialogRef.close(2);
          }
        );
    } else {
      this.productService.saveProduct(uploadImageData).subscribe(
        (data) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    this.selectedFile = event?.target?.files[0];
    this.imageName = this.selectedFile.name;
  }
}
