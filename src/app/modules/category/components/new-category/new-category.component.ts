import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { CategoryElement } from '../category/category.component';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
})
export class NewCategoryComponent implements OnInit {
  public categoryForm!: FormGroup;
  editando: boolean= false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryElement
  ) {}

  ngOnInit(): void {
    if (this.data != null) {
      this.editando = true
      this.categoryForm = this.fb.group({
        name: [this.data.name, Validators.required],
        description: [this.data.description, Validators.required],
      });
    } else {
      this.categoryForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
      });
    }
  }

  onSave() {
    let category = {
      id: this.data?.id,
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value,
    };
    if (this.data != null) {
      this.categoryService.updateCategory(category).subscribe(
        (response) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      this.categoryService.saveCategory(category).subscribe(
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
}
