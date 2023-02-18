import { Component, OnInit } from '@angular/core'
import { Form, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/services/user.service';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { base64ToFile, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
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
  constructor(
      private _coreConfigService: CoreConfigService,
      private modalService: NgbModal,
      private userService: UserService,
      private _formBuilder: UntypedFormBuilder,
      ) {
    // this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
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

    // this.userService.getProfile(this.userId).subscribe({
    //   next: (res: any)=>{
    //     this.sellerProfile = res;
    //     this.profileUpdateFormBuilder();
    //   }
    // })
    this.profileUpdateFormBuilder();

    // this.userService.getAllCategoriesWithSubCategories().subscribe({
    //   next: (res: any)=>{
    //     this.categories = res[0]['results'];
    //   }
    // })
  }

  profileUpdateFormBuilder(){
    this.profileUpdateForm = this._formBuilder.group({
      companyName: [this.sellerProfile?.companyName?this.sellerProfile.companyName: '' , [Validators.required]],
      companyType: [this.sellerProfile?.companyType?this.sellerProfile.companyType: '', Validators.required],
      name: [this.sellerProfile?.name?this.sellerProfile.name: '', Validators.required],
      noOfEmployee: [this.sellerProfile?.noOfEmployee?this.sellerProfile.noOfEmployee: '', Validators.required],
      returnPolicy: [this.sellerProfile?.returnPolicy?this.sellerProfile.returnPolicy: '', Validators.required],
      liabilityInsurance: [this.sellerProfile?.liabilityInsurance?this.sellerProfile.liabilityInsurance: false, Validators.required],
      workerCompensation: [this.sellerProfile?.workerCompensation?this.sellerProfile.workerCompensation: false, Validators.required],
      projectMinimum: [this.sellerProfile?.projectMinimum?this.sellerProfile.projectMinimum: '', Validators.required],
      bonded: [this.sellerProfile?.bonded?this.sellerProfile.bonded: false, Validators.required],
      writtenContract: [this.sellerProfile?.writtenContract?this.sellerProfile.writtenContract: false, Validators.required],
      webURL: [this.sellerProfile?.webURL?this.sellerProfile.webURL: '', Validators.required],
      facebookURL: [this.sellerProfile?.facebookURL?this.sellerProfile.facebookURL: '', Validators.required],
      instagramURL: [this.sellerProfile?.instagramURL?this.sellerProfile.instagramURL: '', Validators.required],
      twitterURL: [this.sellerProfile?.twitterURL?this.sellerProfile.twitterURL: '', Validators.required],
      licenses: [this.sellerProfile?.licenses?this.sellerProfile.licenses: '', Validators.required],
      warrantyTerms: [this.sellerProfile?.warrantyTerms?this.sellerProfile.warrantyTerms: '', Validators.required],
      phone: [this.sellerProfile?.phone?this.sellerProfile.phone: '', Validators.required],
      country: [this.sellerProfile?.country?this.sellerProfile.country: '', Validators.required],
      address: [this.sellerProfile?.address?this.sellerProfile.address: '', Validators.required],
      city: [this.sellerProfile?.city?this.sellerProfile.city: '', Validators.required]
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
}
