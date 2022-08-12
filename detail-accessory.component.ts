import { AccountService } from './../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductAcessoryService } from 'src/app/services/product-acessory.service';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import Swal from 'sweetalert2'
import { ProductAccessory } from 'src/app/models/product-accessory';
@Component({
  selector: 'app-detail-accessory',
  templateUrl: './detail-accessory.component.html',
  styleUrls: ['./detail-accessory.component.css']
})
export class DetailAccessoryComponent implements OnInit {
  getCart: number = 0;
  data: any;
  accountSignIn: any;
  sliderImg: any = [];
  quantityValue: number = 1;
  recommendProduct: any;
  constructor(private accountSer: AccountService, private accessorySer: ProductAcessoryService, private actRout: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0;
    let openMenuInAccountPages = document.getElementById('openMenuInAccountPages') as HTMLDivElement | null;
    openMenuInAccountPages?.classList.add('d-none');
    this.getItem();
    this.accountSignIn = sessionStorage.getItem('accountSignIn');
    this.accountSignIn = JSON.parse(this.accountSignIn);
  }
 
  getItem() {
    let id = this.actRout.snapshot.params['id'];
    this.accessorySer.getItem(id).subscribe((data: any) => {
      this.sliderImg = data.allImg;
      this.data = data;
      this.accessorySer.getAll().subscribe(data => {
        this.recommendProduct = data.filter(item => {
          return item.category_id == this.data.category_id
        })
      })
    })
  }
  OptionsSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  OptionsRecommend: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    // autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  reduceQuantity() {
    let input: any = document.getElementById('quantityInp') as HTMLInputElement;
    this.quantityValue = this.quantityValue - 1;
    if (input.value <= 1 || input.value == '') {
      this.quantityValue = 1
    }
  }
  increaseQuantity() {
    let input: any = document.getElementById('quantityInp') as HTMLInputElement;
    this.quantityValue = this.quantityValue + 1;
    if (input.value <= 0 || input.value == '') {
      this.quantityValue = 1
    }
  }
  navigateToDetailAccessory(id: number) {
    document.documentElement.scrollTop = 0;
    this.router.navigate([`/detailAccessory/${id}`]);
    this.accessorySer.getItem(id).subscribe(data => {
      this.sliderImg = data.allImg;
      this.data = data;
      this.accessorySer.getAll().subscribe(data => {
        this.recommendProduct = data.filter(item => {
          return item.category_id == this.data.category_id
        })
      })
    })
    this.accountSignIn = sessionStorage.getItem('accountSignIn');
  }
  addToCart() {
    if(this.accountSignIn){
      this.accountSer.getItem(this.accountSignIn.id).subscribe((data: any) => {
        let checkData:any = data.cart.find((item: any) => {
          return item.id == this.data.id && item.category_id == this.data.category_id;
        })
        if (checkData) {
          checkData.quantity += this.quantityValue;
          this.accountSer.editItem(this.accountSignIn.id,data).subscribe();
        } else {
          this.getCart = data.cart.length;
          data.cart.push({ id: this.data.id, name: this.data.name, img: this.data.imgProduct, category_id: this.data.category_id, quantity: this.quantityValue, price: this.data.price });
          this.accountSer.editItem(this.accountSignIn.id, data).subscribe();
          this.getCart += 1;
          this.accountSer.totalCard.next(this.getCart);
        }
      })
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'The product has been added to your cart',
        showConfirmButton: false,
        timer: 1000
      })
    }
    else{
      Swal.fire({
        title: 'Please login before adding to cart',
        text: "We will redirect you to the login page. Please log in to an authorized account to continue",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/signin']);
        }
        else{
          return
        }
      })
    }
  }
}
