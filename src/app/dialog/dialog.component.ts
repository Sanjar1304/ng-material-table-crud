import { Component, Inject, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { DialogData } from '../dialog-data';



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ['Brand New', 'Second hand', 'Refurbished'];
  productForm!: FormGroup;
  actionBtn: string = 'Save';

  constructor(private _snackbar: MatSnackBar,
              private fb: FormBuilder,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) public editData: DialogData,
              private dialogRef: MatDialogRef<DialogComponent>) {}

  ngOnInit(): void {
    this.productFormValidation();
    this.patchData();
  }



  editorConfig: AngularEditorConfig = {
    editable: true, 
    spellcheck: true,
    height: '2rem',
    minHeight: '2rem',
    translate: 'yes',
    placeholder: 'Enter text here',
    defaultParagraphSeparator: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {name: 'quote', class: 'quote'},
      {name: 'redText', class: 'redText'},
      {name: 'titleText', class: 'titleText', tag: 'h1',},
    ],
  }



  productFormValidation(){
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    })
  }



  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            this._snackbar.open('product added', 'click', {duration: 1000});
            this.dialogRef.close('save')
          },
          error: () => {
            this._snackbar.open('error while adding product', 'click', {duration: 1000,});
          }
        })
      }
    }else {
      this.updateProduct();
    }
    
    this.productForm.reset()
  }



  
  updateProduct(){
    this.api.updateProduct(this.productForm.value, this.editData.id).subscribe({
        next: (val => {
          this._snackbar.open('product updated successfully', 'click', {duration: 1000});
        }),
        error: (err) => {
          this._snackbar.open(err, 'click', {duration: 1000});
        }
      });

      this.productForm.reset();
      this.dialogRef.close('update')
  }




  patchData(){
    if(this.editData){
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }





}
