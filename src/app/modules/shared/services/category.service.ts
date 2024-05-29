import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CategoryElement } from '../../category/components/category/category.component';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  /**
   * get all categories
   * @returns Observable
   */
  getCategories() {
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }

  /**
   * Get a category by id
   * @param id
   * @returns
   */
  getCategoryById(id: string) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.get(endpoint);
  }

  /**
   * Save a new category
   * @param category
   * @returns Observable
   */
  saveCategory(category: any) {
    const endpoint = `${base_url}/categories`;
    return this.http.post(endpoint, category);
  }

  /**
   * Update a category
   * @param category
   * @returns Observable
   */
  updateCategory(category: CategoryElement) {
    console.log(category);
    const endpoint = `${base_url}/categories/${category.id}`;
    return this.http.put(endpoint, {
      name: category.name,
      description: category.description,
    });
  }

  /**
   * Delete a category
   * @param id
   * @returns
   */
  deleteCategory(id: number) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * exportCategoriesToExcel
   * @returns
   */
  exportCategoriesToExcel() {
    const endpoint = `${base_url}/categories/export/excel`;
    return this.http.get(endpoint, { responseType: 'blob' });
  }
}
