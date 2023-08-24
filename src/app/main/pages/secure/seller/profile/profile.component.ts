import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { Form, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/services/user.service';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { base64ToFile, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ClipboardService } from 'ngx-clipboard';
import { MapCircle } from '@angular/google-maps';
import { GoogleMapsService } from '@core/services/services/googlemap.service';
import { AuthenticationService } from '@core/services/authentication.service';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public baseURL: any = environment.serverURL;
  public contentHeader: object;
  public progressbarHeight = '.857rem';
  public sellerProfile: any;
  public profileUpdateForm: UntypedFormGroup;
  public submitted = false;
  public userId = '';
  public categories: any;
  public sellerCategories: any;
  public sellerServicePhotos: any;
  myFiles: string[] = [];
  public sellerWebLinksForm: UntypedFormGroup;
  public markerCirclePolygonCenter;
  public markerCirclePolygonZoom = 13;
  @ViewChild("mapCircle") circle: MapCircle;
  public sliderWithNgModel: number = 5;
  @ViewChild('map') mapElement: any;
  map: any;
  public mapCircleCenter: google.maps.LatLngLiteral;
  public mapCircleOptions;
  public countriesData: any;

  public countriesList = [];
  countries: string[] = [];
  public countryStates = [];
  countryCities: string[] = [];
  searchText0: string = "";
  searchText1: string = "";
  searchText2: string = "";
  searchText3: string = "";
  // country: number;
  // state: any;
  // city: any;

  // // Define the LatLng coordinates for the polygon's  outer path.
  // private polygonCoords = [
  //   { lat: 37.421834, lng: -122.079971 },
  //   { lat: 37.421672, lng: -122.07273 },
  //   { lat: 37.419884, lng: -122.079213 }
  // ];

  // public mapPolygonPaths = [this.polygonCoords];

  // public mapPolygonOptions = {
  //   strokeColor: '#3164bf',
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   radius: 200,
  //   fillColor: '#3164bf',
  //   fillOpacity: 0.35,
  //   draggable: true,
  //   center: { lat: 37.421995, lng: -122.084092 }
  // };
  public postalCode = "";
  public nearByZipCodes = [];
  zipCode: string = '';
  radius: number = 0;
  zipCodes: string[] = [];
  constructor(
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private userService: UserService,
    private _formBuilder: UntypedFormBuilder,
    private clipboardService: ClipboardService,
    private googleMapsService: GoogleMapsService,
    private authenticationSerive: AuthenticationService,
    private http: HttpClient
  ) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
  }
  ngAfterViewInit(): void {
    this.getLocation();
  }
  radiusChanged() {
    if (this.circle) {
      console.log(this.circle.getRadius());
    }
  }

  public selectedCategories: any = [];
  selectCategory(categryId, midLevelId, subcategry) {
    // if(categry && this.selectedCategories.length > 0){
    //   let indexOf = -1;
    //   this.selectedCategories.find((cat, index)=>{
    //     if(cat._id === categry._id){
    //       indexOf = index;
    //     }
    //   })
    //   if(indexOf != -1 && this.selectedCategories.length > 0 && this.selectedCategories[indexOf]['subCategory'].length  > 0){
    //     let subIndex = -1;
    //     this.selectedCategories[indexOf]['subCategory'].find((subcat, index)=>{
    //       if(subcat._id === subcategry._id){
    //         subIndex = index;
    //       }
    //     })
    //     if(subIndex == -1){
    //       this.selectedCategories[indexOf]['subCategory'].push(subcategry);
    //     }else{
    //       this.selectedCategories[indexOf]['subCategory'].splice(subIndex,1);
    //       if(this.selectedCategories[indexOf]['subCategory'].length <= 0){
    //         this.selectedCategories.splice(indexOf,1);
    //       }
    //     }
    //   }else{
    //     categry['subCategory'] = [];
    //     categry['subCategory'].push(subcategry);
    //     this.selectedCategories.push(categry);
    //   }
    // }else{
    //   categry['subCategory'] = [];
    //   categry['subCategory'].push(subcategry);
    //   this.selectedCategories.push(categry);
    // }

    if (this.selectedCategories && this.selectedCategories.length > 0) {
      let index = -1;
      this.selectedCategories.find((elem, i) => {
        if (elem._id === subcategry._id) {
          index = i;
        }
      })
      if (subcategry && index > -1) {
        this.selectedCategories.splice(index, 1)
      } else {
        let item = subcategry;
        item['categoryId'] = categryId;
        item['midLevelCategoryId'] = midLevelId;
        this.selectedCategories.push(item)
      }
    } else {
      let item = subcategry;
      item['categoryId'] = categryId;
      item['midLevelCategoryId'] = midLevelId;
      this.selectedCategories.push(item)
    }
  }
  saveCategories() {
    let data = {};
    data['userId'] = this.userId;
    data['addCategories'] = this.selectedCategories;
    this.userService.saveSellerCategories(data)
      .subscribe(res => {
        this.selectedCategories = [];
        setTimeout(() => {
          this.modalService.dismissAll();
          this.userService.getSellerCategoriesWithSubCategories(this.userId).subscribe({
            next: (res: any) => {
              this.filterCategories = [];
              this.sellerCategories = res[0]['results'];
              this.sellerCategories.forEach(element => {
                if (this.filterCategories.length <= 0) {
                  let item = element.category;
                  item['subcategory'] = [];
                  item['subcategory'].push(element.subcategory);
                  this.filterCategories.push(item);
                } else {
                  let matchAdded = false;
                  this.filterCategories.forEach(item => {
                    if (item._id === element.category._id) {
                      matchAdded = true;
                      item['subcategory'].push(element.subcategory);
                    }
                  })
                  if (!matchAdded) {
                    let item = element.category;
                    item['subcategory'] = [];
                    item['subcategory'].push(element.subcategory);
                    this.filterCategories.push(item);
                  }
                }
              });
              console.log(this.filterCategories);
            }
          })
        }, 3000)
      })
  }

  getCountries() {

    this.http.get("https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json").subscribe({
      next: (res: any) => {

        this.countriesData = res;

        const country = [...new Set(this.countriesData.map(item => item.country))];
        this.countriesList = country;
      }
    })
  }

  onCountryChange(country: any) {

    let state = this.countriesData.filter(state => state.country === country);
    state = [...new Set(state.map(item => item.subcountry))];
    state.sort();
    this.countryStates = state;

  }

  onStateChange(state: any) {
    console.log(state)
    let city = this.countriesData.filter(city => city.subcountry === state);
    city = [...new Set(city.map(item => item.name))];
    city.sort();
    this.countryCities = city;
  }


  onFileChange(event: any) {

    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
  }

  getAllSellerServiceImages() {

    this.userService.getUserSerivesPhotos(this.userId)
      .subscribe(res => {
        this.sellerServicePhotos = res;
      })
  }
  deleteImage(item) {
    this.userService.deleteUserSerivesPhoto(item._id)
      .subscribe(res => {
        this.getAllSellerServiceImages();
      })
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  public show = false;
  public filterCategories = [];
  /**
   * On init
   */
  center: google.maps.LatLngLiteral;
  ngOnInit() {
    this.getCountries();
    // const mapProperties = {
    //   center: new google.maps.LatLng(36.2271, -80.8431),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    //   };
    // this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);
    // const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    //   center: { lat: 37.7749, lng: -122.4194 },
    //   zoom: 8,
    // });
    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ address: 'San Francisco' }, (results, status) => {
    //   if (status === 'OK') {
    //     this.center = results[0].geometry.location.toJSON() as google.maps.LatLngLiteral;
    //     this.radius = 10000; // set radius to 10 km
    //     this.getZipCodes(map, this.center, this.sliderWithNgModel);
    //   }
    // });
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
      next: (res: any) => {

        this.sellerProfile = res;
        if (this.sellerProfile.postalCode) {
          this.postalCode = this.sellerProfile.postalCode;
        }
        if (this.sellerProfile.nearByPostalCodes) {
          this.nearByZipCodes = this.sellerProfile.nearByPostalCodes.split(',');
        }
        if (this.sellerProfile.radius) {
          this.sliderWithNgModel = parseInt(this.sellerProfile.radius);
        }
        this.profileUpdateFormBuilder();
      }
    })
    // this.selectBasicMethod();
    // this.userService.getAllCategoriesWithSubCategories().subscribe({
    //   next: (res: any)=>{
    //     this.categories = res[0]['results'];
    //   }
    // })

    this.userService.getSellerCategoriesWithSubCategories(this.userId).subscribe({
      next: (res: any) => {
        this.sellerCategories = res[0]['results'];
        this.sellerCategories.forEach(element => {
          if (this.filterCategories.length <= 0) {
            let item = element.category;
            item['subcategory'] = [];
            item['subcategory'].push(element.subcategory);
            this.filterCategories.push(item);
          } else {
            let matchAdded = false;
            this.filterCategories.forEach(item => {
              if (item._id === element.category._id) {
                matchAdded = true;
                item['subcategory'].push(element.subcategory);
              }
            })
            if (!matchAdded) {
              let item = element.category;
              item['subcategory'] = [];
              item['subcategory'].push(element.subcategory);
              this.filterCategories.push(item);
            }
          }
        });

      }
    })
    this.getAllSellerServiceImages();
    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: true,
      headerRight: false,
    }
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {
        this.sellerProfile = res;
        this.profileUpdateFormBuilder();
      }
    })
    // this.profileUpdateFormBuilder();

    this.userService.getAllCategoriesWithSubCategories().subscribe({
      next: (res: any) => {
        this.categories = res[0]['results'];
      }
    })
  }

  onSubmitSearch() {
    const Text = this.searchText0;
    console.log(Text)
    // this.http.post("https://api.moventag.com/reviews/searchSellerReview", {
    //   sellerId: this.user._id,
    //   userReviewed: true,
    //   orderNum: Text
    // }).subscribe({
    //   next: (res: any) => {
    //     if (res.length < 1) {
    //       // this.getAllReviews();
    //       this.userQuote = [];
    //       return;
    //     }
    //     this.userQuote = [res];
    //     this.total = 1;
    //   }
    // })
  }

  onSubmitClear() {
    console.log("Clear")
    // this.getAllReviews();
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
    this.getLocation();
  }
  profileUpdateFormBuilder() {
    this.profileUpdateForm = this._formBuilder.group({
      companyName: [this.sellerProfile?.companyName ? this.sellerProfile.companyName : '', [Validators.required]],
      description: [this.sellerProfile?.description ? this.sellerProfile.description : '', [Validators.required]],
      companyType: [this.sellerProfile?.companyType ? this.sellerProfile.companyType : '', Validators.required],
      noOfEmployee: [this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : '', Validators.required],
      returnPolicy: [this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : '', Validators.required],
      liabilityInsurance: [this.sellerProfile?.liabilityInsurance ? this.sellerProfile.liabilityInsurance : false, Validators.required],
      workerCompensation: [this.sellerProfile?.workerCompensation ? this.sellerProfile.workerCompensation : false, Validators.required],
      projectMinimum: [this.sellerProfile?.projectMinimum ? this.sellerProfile.projectMinimum : '', Validators.required],
      bonded: [this.sellerProfile?.bonded ? this.sellerProfile.bonded : false, Validators.required],
      writtenContract: [this.sellerProfile?.writtenContract ? this.sellerProfile.writtenContract : false, Validators.required],
      address: [this.sellerProfile?.address ? this.sellerProfile.address : '', Validators.required],
      postalCode: [this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : '', Validators.required],
      paymentMethod: [this.sellerProfile?.paymentMethod ? this.sellerProfile.paymentMethod : '', Validators.required],
      warrantyTerms: [this.sellerProfile?.warrantyTerms ? this.sellerProfile.warrantyTerms : '', Validators.required],
      country: [this.sellerProfile?.country ? this.sellerProfile.country : '', Validators.required],
      state: [this.sellerProfile?.state ? this.sellerProfile.state : '', Validators.required],
      city: [this.sellerProfile?.city ? this.sellerProfile.city : '', Validators.required],
    });

    this.sellerWebLinksForm = this._formBuilder.group({
      webURL: [this.sellerProfile?.webURL ? this.sellerProfile.webURL : ''],
      facebookURL: [this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : '', Validators.required],
      instagramURL: [this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : '', Validators.required],
      twitterURL: [this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : '', Validators.required],
      phone: [this.sellerProfile?.phone ? this.sellerProfile.phone : '', Validators.required],
    });
  }
  copyText() {
    this.clipboardService.copyFromContent(this.sellerProfile?.referralCode);
  }
  onUpdateLinks() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.sellerWebLinksForm.invalid) {
      return;
    }
    let data = this.sellerWebLinksForm.value;
    data['id'] = this.userId;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.modalService.dismissAll();
        this.sellerProfile = res;
      },
      error: (err) => {
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
    this.coverPhotoChangedEvent = '';
    this.coverPhotoCroppedImage = '';
    this.companyPhotoChangedEvent = '';
    this.CompanyPhotoCroppedImage = '';
    this.servicePhotoChangedEvent = '';
    this.servicePhotoCroppedImage = '';
    this.coverPhotoCroppedImageFile = null;
    this.CompanyPhotoCroppedImageFile = null;
    this.servicePhotoCroppedImageFile = null;
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

  servicePhotoChangedEvent: any = '';
  servicePhotoCroppedImage: any = '';
  servicePhotoCroppedImageFile: any;


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

  servicefileChangeEvent(event: any): void {
    this.servicePhotoChangedEvent = event;
  }

  companyimageCropped(event: ImageCroppedEvent) {
    this.CompanyPhotoCroppedImage = event.base64;
    this.CompanyPhotoCroppedImageFile = base64ToFile(this.CompanyPhotoCroppedImage);
  }

  serviceImageCropped(event: ImageCroppedEvent) {
    this.servicePhotoCroppedImage = event.base64;
    this.servicePhotoCroppedImageFile = base64ToFile(this.servicePhotoCroppedImage);
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
    data['id'] = this.userId;

    this.authenticationSerive.updateProfile(data).subscribe({
      next: (res) => {
        this.modalService.dismissAll();
        this.sellerProfile = res;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }


  onSaveNearByZipCode() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.postalCode === '' || this.nearByZipCodes.length <= 0) {
      return;
    }
    let data = {};
    data['postalCode'] = this.postalCode;
    data['radius'] = this.sliderWithNgModel;
    data['nearByPostalCodes'] = this.nearByZipCodes.toString();
    data['id'] = this.userId;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.modalService.dismissAll();
        this.sellerProfile = res;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  uploadCoverPhoto() {
    if (this.coverPhotoCroppedImageFile) {
      let data: FormData = new FormData();
      data.append('coverImage', this.coverPhotoCroppedImageFile, 'image/png')
      data.append('id', this.userId)
      this.userService.updateCoverPhoto(data).subscribe({
        next: (res) => {
          this.modalService.dismissAll();
          this.sellerProfile = res;
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
  }

  uploadProfilePhoto() {
    if (this.CompanyPhotoCroppedImageFile) {
      let data: FormData = new FormData();
      data.append('profileImage', this.CompanyPhotoCroppedImageFile, 'image/png')
      data.append('id', this.userId)
      this.authenticationSerive.updateProfile(data).subscribe({
        next: (res) => {
          this.modalService.dismissAll();
          this.sellerProfile = res;
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
  }
  uploadServicePhotos() {
    const formData = new FormData();
    formData.append("servicePhotos", this.servicePhotoCroppedImageFile, 'image/png');
    formData.append("id", this.userId);
    this.userService.addUserSerivesPhotos(formData)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getAllSellerServiceImages();
      })
  }

  public findCheckOrNot(id) {
    let findIdExists = this.sellerCategories.find(elem => elem.subCategoryId === id);
    if (findIdExists) {
      return true;
    }
    return false;
  }




  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: latLng,
      zoom: 10
    });

    const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ address: latLng }, (results, status) => {
    //   if (status === 'OK') {
    //     this.center = results[0].geometry.location.toJSON() as google.maps.LatLngLiteral;
    //     this.radius = 10000; // set radius to 10 km
    //     this.getZipCodes(this.map, this.center, this.sliderWithNgModel);
    //   }
    // });
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        const addressComponents = results[0].address_components;
        this.postalCode = addressComponents.find(component => component.types.includes('postal_code')).long_name;
        // this.getZipCodes(this.map, latLng, this.sliderWithNgModel);

        // Do something with the zipCode value
      }
    });


    // Extract the postal codes from the nearby locations
    this.mapCircleCenter = { lat: latLng.lat(), lng: latLng.lng() };
    this.mapCircleOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      radius: this.sliderWithNgModel * 1609.34,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      center: { lat: latLng.lat(), lng: latLng.lng() }
    };
    this.markerCirclePolygonCenter = { lat: latLng.lat(), lng: latLng.lng() };
    // this.getZipCodes(latLng, this.radius);
  }

  // setRadius(radius: number) {
  //   this.radius = radius;
  //   // this.getZipCodes(this.map.center, radius);
  // }
  // getZipCodes(map: google.maps.Map, center: google.maps.LatLngLiteral, radius: number) {
  //   const request = {
  //     location: center,
  //     radius: radius,
  //     type: 'postal_code'
  //   };
  //   const service = new google.maps.places.PlacesService(map);
  //   service.nearbySearch(request, (results, status) => {
  //     if (status === 'OK') {
  //       this.zipCodes = results.map(result => result.postal_code);
  //     }
  //   });
  // }
  // getZipCodes(latLng, radius) {
  //   const request = {
  //     location: latLng,
  //     radius: radius.toString(),
  //     type: ['postal_code']
  //   };

  //   const service = new google.maps.places.PlacesService(this.map);
  //   service.nearbySearch(request, this.callback.bind(this));
  // }


  callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map
        });
      }
    }
  }

  public findNearByPostalCode() {
    let queryParam = '?zipcode=' + this.postalCode + '&miles=' + this.sliderWithNgModel * 1609.344;
    this.userService.getNearByPostalCode(queryParam)
      .subscribe(res => {
        this.nearByZipCodes = res;
      })
    //  Call the getZipCodesInRadius method of the GoogleMapsService
    //  this.googleMapsService.findNearbyZipcodes(this.mapCircleCenter.lat, this.mapCircleCenter.lng, this.sliderWithNgModel)
    //  .then((zipCodes) => {
    //    // Update the zipCodes array with the results
    //    this.zipCodes = zipCodes;
    //  })
    //  .catch((error) => {
    //    console.error(error);
    //    alert('An error occurred. Please try again later.');
    //  });

    //  this.setRadius(this.sliderWithNgModel);
  }
  public isReadMore = true;
  showFullDescription() {
    this.isReadMore = !this.isReadMore
  }
}
