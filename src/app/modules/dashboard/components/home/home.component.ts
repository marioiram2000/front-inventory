import { Component, OnInit } from '@angular/core';
import { ProductElement } from 'src/app/modules/product/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  chartBar: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

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
    const productNames: string[] = [];
    const quantity: number[] = [];
    const dateProduct: ProductElement[] = [];
    if (resp.metadata[0].code == '00') {
      console.log(resp);

      let listCProduct = resp.product.product;
      listCProduct.forEach((product: ProductElement) => {
        productNames.push(product.name);
        quantity.push(product.quantity)
      });

    }
  }
}
