import { Component, OnInit } from '@angular/core'
import { Form, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/services/user.service';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { base64ToFile, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ClipboardService } from 'ngx-clipboard';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public baseURL: any = environment.apiUrl;
  public contentHeader: object;
  public progressbarHeight = '.857rem';
  public sellerProfile: any;
  public profileUpdateForm: UntypedFormGroup;
  public submitted = false;
  public userId = '';
  public categories: any;
  public sellerCategories: any;
  public sellerServicePhotos: any;
  myFiles:string [] = [];
  public sellerWebLinksForm: UntypedFormGroup;

  constructor(
      private _coreConfigService: CoreConfigService,
      private modalService: NgbModal,
      private userService: UserService,
      private _formBuilder: UntypedFormBuilder,
      private clipboardService: ClipboardService
      ) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
  }
  public selectedCategories: any = [];
  selectCategory(categry, subcategry){
    if(categry && this.selectedCategories.length > 0){
      let indexOf = -1;
      this.selectedCategories.find((cat, index)=>{
        if(cat._id === categry._id){
          indexOf = index;
        }
      })
      if(indexOf != -1 && this.selectedCategories.length > 0 && this.selectedCategories[indexOf]['subCategory'].length  > 0){
        let subIndex = -1;
        this.selectedCategories[indexOf]['subCategory'].find((subcat, index)=>{
          if(subcat._id === subcategry._id){
            subIndex = index;
          }
        })
        if(subIndex == -1){
          this.selectedCategories[indexOf]['subCategory'].push(subcategry);
        }else{
          this.selectedCategories[indexOf]['subCategory'].splice(subIndex,1);
          if(this.selectedCategories[indexOf]['subCategory'].length <= 0){
            this.selectedCategories.splice(indexOf,1);
          }
        }
      }else{
        categry['subCategory'] = [];
        categry['subCategory'].push(subcategry);
        this.selectedCategories.push(categry);
      }
    }else{
      categry['subCategory'] = [];
      categry['subCategory'].push(subcategry);
      this.selectedCategories.push(categry);
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


  onFileChange(event:any) {
   
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myFiles.push(event.target.files[i]);
    }
  } 

  getAllSellerServiceImages(){
  
    this.userService.getUserSerivesPhotos(this.userId)
      .subscribe(res => {
        this.sellerServicePhotos = res;
      })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  public show = false;
  /**
   * On init
   */
  ngOnInit() {
   
    this.contentHeader = {
      headerTitle: 'Home',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Sample',
            isLink: false
          }
        ]
      }
    }
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
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any)=>{
        this.sellerProfile = res;
        this.profileUpdateFormBuilder();
      }
    })
    // this.profileUpdateFormBuilder();

    this.userService.getAllCategoriesWithSubCategories().subscribe({
      next: (res: any)=>{
        this.categories = res[0]['results'];
      }
    })
  }
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
  copyText() {
    this.clipboardService.copyFromContent(this.sellerProfile?.referralCode);
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

  uploadCoverPhoto(){
      if(this.coverPhotoCroppedImageFile){
        let data :FormData = new FormData();
        data.append('coverImage', this.coverPhotoCroppedImageFile)
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
      data.append('profileImage', this.CompanyPhotoCroppedImageFile)
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
  uploadServicePhotos(){
    const formData = new FormData();
 
    // for (var i = 0; i < this.myFiles.length; i++) { 
      formData.append("servicePhotos", this.myFiles[0]);
    // }
    formData.append("id", this.userId);
    this.userService.addUserSerivesPhotos(formData)
      .subscribe(res => {
        this.modalService.dismissAll();
        console.log(res);
        this.getAllSellerServiceImages();
      })
  }
}
