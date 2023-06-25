import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit, AfterContentChecked } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/services/user.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { environment } from 'environments/environment';

import { ClipboardService } from 'ngx-clipboard';
import { base64ToFile, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, AfterContentChecked {
  // public
  public baseURL: any = environment.serverURL;
  public contentHeader: object;
  public sellerProfile: any;
  public profileUpdateForm: UntypedFormGroup;
  public sellerWebLinksForm: UntypedFormGroup;
  public submitted = false;
  public userId = '';
  public categories: any;
  public sellerCategories: any;
 


  constructor(private modalService: NgbModal,
      private userService: UserService,
      private _formBuilder: UntypedFormBuilder,
       public clipboardService: ClipboardService) {
            this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
           

      }

  public progressbarHeight = '.857rem';
  modalOpenVC(modalVC) {
    this.myFiles = [];
    this.modalService.open(modalVC, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCProfilePic(modalVCProfilePic) {
    this.modalService.open(modalVCProfilePic, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCCover(modalVCCover) {
    this.modalService.open(modalVCCover, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCChangePass(modalVCChangePass) {
    this.modalService.open(modalVCChangePass, {
      centered: true,
      size: 'sm' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCContactDet(modalVCContactDet) {
    this.modalService.open(modalVCContactDet, {
      centered: true,
      size: 'sm' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCAbout(modalVCAbout) {
    this.modalService.open(modalVCAbout, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalOpenVCCategories(modalVCCategories) {
    this.modalService.open(modalVCCategories, {
      centered: true,
      size: 'xl' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.profileUpdateFormBuilder();
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any)=>{
        this.sellerProfile = res;
        this.profileUpdateFormBuilder();
      }
    })
    // this.selectBasicMethod();
    this.userService.getAllCategoriesWithSubCategories().subscribe({
      next: (res: any)=>{
        this.categories = res[0]['results'];
      }
    })
    
    this.userService.getSellerCategoriesWithSubCategories(this.userId).subscribe({
      next: (res: any)=>{
        this.sellerCategories = res[0]['results'];
      }
    })
    this.getAllSellerServiceImages();
    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: true,
      headerRight: false,
    }
    
  }

  ngAfterViewInit(): void {
    this.sellerProfile = this.sellerProfile;
  }

  ngAfterContentChecked(): void {
    
    this.sellerProfile = this.sellerProfile;

  }

  profileUpdateFormBuilder(){
    this.profileUpdateForm = this._formBuilder.group({
      companyName: [this.sellerProfile?.companyName?this.sellerProfile.companyName: '' , [Validators.required]],
      description: [this.sellerProfile?.description?this.sellerProfile.description: '' , [Validators.required]],
      companyType: [this.sellerProfile?.companyType?this.sellerProfile.companyType: '', Validators.required],
      noOfEmployee: [this.sellerProfile?.noOfEmployee?this.sellerProfile.noOfEmployee: '', Validators.required],
      returnPolicy: [this.sellerProfile?.returnPolicy?this.sellerProfile.returnPolicy: '', Validators.required],
      liabilityInsurance: [this.sellerProfile?.liabilityInsurance?this.sellerProfile.liabilityInsurance: false, Validators.required],
      workerCompensation: [this.sellerProfile?.workerCompensation?this.sellerProfile.workerCompensation: false, Validators.required],
      projectMinimum: [this.sellerProfile?.projectMinimum?this.sellerProfile.projectMinimum: '', Validators.required],
      bonded: [this.sellerProfile?.bonded?this.sellerProfile.bonded: false, Validators.required],
      writtenContract: [this.sellerProfile?.writtenContract?this.sellerProfile.writtenContract: false, Validators.required] ,
      address: [this.sellerProfile?.address?this.sellerProfile.address: '', Validators.required],
      postalCode: [this.sellerProfile?.postalCode?this.sellerProfile.postalCode: '', Validators.required],
    });

    this.sellerWebLinksForm = this._formBuilder.group({
      webURL: [this.sellerProfile?.webURL?this.sellerProfile.webURL: ''],
      facebookURL: [this.sellerProfile?.facebookURL?this.sellerProfile.facebookURL: '', Validators.required],
      instagramURL: [this.sellerProfile?.instagramURL?this.sellerProfile.instagramURL: '', Validators.required],
      twitterURL: [this.sellerProfile?.twitterURL?this.sellerProfile.twitterURL: '', Validators.required],
      phone: [this.sellerProfile?.phone?this.sellerProfile.phone: '', Validators.required],
    });
  }
  modalEditDetail(modalEditDetail) {
    this.modalService.open(modalEditDetail, {
      centered: true,
      size: 'xl' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalUpdateCategory(modalUpdateCategory) {
    this.modalService.open(modalUpdateCategory, {
      centered: true,
      size: 'xl' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalUpdatePhoto(modalUpdatePhoto) {
    this.coverPhotoChangedEvent= '';
    this.coverPhotoCroppedImage = '';
    this.companyPhotoChangedEvent = '';
    this.CompanyPhotoCroppedImage = '';
    this.coverPhotoCroppedImageFile = null;
    this.CompanyPhotoCroppedImageFile = null;
    this.modalService.open(modalUpdatePhoto, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  
  coverPhotoChangedEvent: any = '';
  coverPhotoCroppedImage: any = '';
  coverPhotoCroppedImageFile: any;

  companyPhotoChangedEvent: any = '';
  CompanyPhotoCroppedImage: any = '';
  CompanyPhotoCroppedImageFile: any;

  coverfileChangeEvent(event: any): void {
      this.coverPhotoChangedEvent = event;
  }

  coverimageCropped(event: ImageCroppedEvent) {
      this.coverPhotoCroppedImage = event.base64;
      this.coverPhotoCroppedImageFile = base64ToFile(this.coverPhotoCroppedImage);
  }
  companyfileChangeEvent(event: any): void {
    this.companyPhotoChangedEvent = event;
}

  companyimageCropped(event: ImageCroppedEvent) {
      this.CompanyPhotoCroppedImage = event.base64;
      this.CompanyPhotoCroppedImageFile = base64ToFile(this.CompanyPhotoCroppedImage);
  }
  imageLoaded(image?: LoadedImage) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.profileUpdateForm.invalid) {
      // return;
    }
    let data = this.profileUpdateForm.value;
    data['id']= this.userId;
    this.userService.updateProfile(data).subscribe({
      next: (res)=> {
        this.modalService.dismissAll();
        this.sellerProfile = res;
      },
      error: (err)=>  {
        console.log(err);
      },
    })
  }
  onUpdateLinks(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.sellerWebLinksForm.invalid) {
      return;
    }
    let data = this.sellerWebLinksForm.value;
    data['id']= this.userId;
    this.userService.updateProfile(data).subscribe({
      next: (res)=> {
        this.modalService.dismissAll();
        this.sellerProfile = res;
      },
      error: (err)=>  {
        console.log(err);
      },
    })
  }
  uploadCoverPhoto(){
      if(this.coverPhotoCroppedImageFile){
        let data :FormData = new FormData();
        data.append('coverImage', this.coverPhotoCroppedImageFile, 'image/png')
        data.append('id', this.userId)
        this.userService.updateCoverPhoto(data).subscribe({
          next: (res)=> {
            this.modalService.dismissAll();
            this.sellerProfile = res;
          },
          error: (err)=>  {
            console.log(err);
          },
        })
      }
  }

  uploadProfilePhoto(){
    if(this.CompanyPhotoCroppedImageFile){
      let data :FormData = new FormData();
      data.append('profileImage', this.CompanyPhotoCroppedImageFile , 'image/png')
      data.append('id', this.userId)
      this.userService.updateProfile(data).subscribe({
        next: (res)=> {
          this.modalService.dismissAll();
          this.sellerProfile = res;
        },
        error: (err)=>  {
          console.log(err);
        },
      })
    }
  }
  copyText() {
    this.clipboardService.copyFromContent(this.sellerProfile?.referralCode);
  }
  public selectedCategories: any = [];
  selectCategory(item){
    if(item && this.selectedCategories.length > 0){
      let indexOf = -1;
      let existing = this.selectedCategories.find((subcat, index)=>{
        if(subcat._id === item._id){
          indexOf = index;
          return subcat;
        }
      })
      if(indexOf != -1){
        this.selectedCategories.splice(0,indexOf);
      }else{
        this.selectedCategories.push(item);
      }
    }else{
      this.selectedCategories.push(item);
    }
  }
  saveCategories(){
    let data = {};
    data ['userId'] = this.userId;
    data['addCategories']= this.selectedCategories;
    this.userService.saveSellerCategories(data)
    .subscribe(res => {
      this.modalService.dismissAll();
      this.userService.getSellerCategoriesWithSubCategories(this.userId).subscribe({
        next: (res: any)=>{
          this.sellerCategories = res[0]['results'];
        }
      })
    })
  }

  myFiles:string [] = [];


  onFileChange(event:any) {
   
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myFiles.push(event.target.files[i]);
    }
  } 
  public sellerServicePhotos: any;

  getAllSellerServiceImages(){
  
    this.userService.getUserSerivesPhotos(this.userId)
      .subscribe(res => {
        this.sellerServicePhotos = res;
      })
  }



}
