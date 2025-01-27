import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  Form,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { UserService } from "@core/services/services/user.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "environments/environment";
import {
  base64ToFile,
  ImageCroppedEvent,
  LoadedImage,
} from "ngx-image-cropper";
import { ClipboardService } from "ngx-clipboard";
import { MapCircle } from "@angular/google-maps";
import { GoogleMapsService } from "@core/services/services/googlemap.service";
import { AuthenticationService } from "@core/services/authentication.service";

import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
} from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import {
  map,
  catchError,
  tap,
  take,
  takeWhile,
  takeUntil,
} from "rxjs/operators";
import { Observable, throwError, interval, Subject } from "rxjs";

declare var google: any;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public userSavedZipCodes = "";
  public searchTypeFind = "";
  public customPostalCodeFromPofile = "";
  public baseURL: any = environment.serverURL;
  public contentHeader: object;
  public progressbarHeight = ".857rem";
  public sellerProfile: any;
  public profileUpdateForm: UntypedFormGroup;
  public submitted = false;
  public userId = "";
  public categories: any;
  public searchSubCategories: any;
  public sellerCategories: any;
  public sellerServicePhotos: any;
  myFiles: string[] = [];
  public sellerWebLinksForm: UntypedFormGroup;
  public markerCirclePolygonCenter;
  public markerCirclePolygonZoom = 13;
  @ViewChild("mapCircle") circle: MapCircle;
  public sliderWithNgModel: number = 5;
  @ViewChild("map") mapElement: any;
  map: any;
  public mapCircleCenter: google.maps.LatLngLiteral;
  public mapCircleOptions;
  public countriesData: any;
  public countriesDataCustom: any;

  public countriesList = [];
  countries: string[] = [];
  public countryStates = [];
  public countryCitiesZipCode = [];
  public countryCitiesCustom = [];
  countryCities: string[] = [];
  searchText: string = "";
  selectedOption = 1;
  phoneCode = "";
  phone = "";
  code = "";
  countryCode = [
    {
      name: "United States",
      dial_code: "+1",
      code: "US",
    },
  ];
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
  public postalCodeCustom = "";
  public nearByZipCodes = [];
  public nearByZipCodesCount = 0;

  public searchedLat = 0;
  public searchedLon = 0;

  zipCode: string = "";
  radius: number = 0;
  zipCodes: string[] = [];

  progress: number;
  progressProfile: number;
  progressStart: boolean;
  progressProfileStart: boolean;
  modelSize: "xl";

  selectedServiceImage = "";
  constructor(
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private userService: UserService,
    private _formBuilder: UntypedFormBuilder,
    private clipboardService: ClipboardService,
    private googleMapsService: GoogleMapsService,
    private authenticationSerive: AuthenticationService,
    private http: HttpClient,
    private toastrService: ToastrService
  ) {
    this.userId = JSON.parse(window.localStorage.getItem("currentUser"))._id;
  }
  ngAfterViewInit(): void {
    // this.getLocation();
  }
  radiusChanged() {
    if (this.circle) {
      console.log(this.circle.getRadius());
    }
  }

  private apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";

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
      });
      if (subcategry && index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        let item = subcategry;
        item["categoryId"] = categryId;
        item["midLevelCategoryId"] = midLevelId;
        this.selectedCategories.push(item);
      }
    } else {
      let item = subcategry;
      item["categoryId"] = categryId;
      item["midLevelCategoryId"] = midLevelId;
      this.selectedCategories.push(item);
    }
  }

  saveCategories() {
    let data = {};
    data["userId"] = this.userId;
    data["addCategories"] = this.selectedCategories;

    this.userService.saveSellerCategories(data).subscribe((res) => {
      this.selectedCategories = [];
      window.location.reload();
      setTimeout(() => {
        this.modalService.dismissAll();
        this.userService
          .getSellerCategoriesWithSubCategories(this.userId)
          .subscribe({
            next: (res: any) => {
              this.filterCategories = [];
              this.sellerCategories = res[0]["results"];
              this.sellerCategories.forEach((element) => {
                if (this.filterCategories.length <= 0) {
                  let item = element.category;
                  item["subcategory"] = [];
                  item["subcategory"].push(element.subcategory);
                  this.filterCategories.push(item);
                } else {
                  let matchAdded = false;
                  this.filterCategories.forEach((item) => {
                    if (item._id === element.category._id) {
                      matchAdded = true;
                      item["subcategory"].push(element.subcategory);
                    }
                  });
                  if (!matchAdded) {
                    let item = element.category;
                    item["subcategory"] = [];
                    item["subcategory"].push(element.subcategory);
                    this.filterCategories.push(item);
                  }
                }
              });
              console.log(this.filterCategories);
            },
          });
      }, 3000);
    });
  }

  getCountries() {
    this.http
      .get(
        "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
      )
      .subscribe({
        next: (res: any) => {
          this.countriesData = res;

          const filteredData = this.countriesData.filter(
            (item) =>
              item.country === "Canada" || item.country === "United States"
          );

          const country = [
            ...new Set(filteredData.map((item) => item.country)),
          ];
          this.countriesList = country;
        },
      });
  }

  onCountryChangeZipCodes(country: any) {
    this.countryZipCodes = country;
    let city = this.countriesData.filter((state) => state.country === country);
    city = [...new Set(city.map((item) => item.name))];
    city.sort();
    this.countryCitiesZipCode = city;
  }

  onCityChangeZipCodes(city: any) {
    this.cityZipCodes = city;
  }

  onCountryChange(country: any) {
    let state = this.countriesData.filter((state) => state.country === country);
    state = [...new Set(state.map((item) => item.subcountry))];
    state.sort();
    this.countryStates = state;
  }

  onStateChange(state: any) {
    let city = this.countriesData.filter((city) => city.subcountry === state);
    city = [...new Set(city.map((item) => item.name))];
    city.sort();
    this.countryCities = city;
  }

  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
  }

  getAllSellerServiceImages() {
    this.userService.getUserSerivesPhotos(this.userId).subscribe((res) => {
      this.sellerServicePhotos = res;
    });
  }

  deleteImage(item) {
    this.userService.deleteUserSerivesPhoto(item._id).subscribe((res) => {
      this.getAllSellerServiceImages();
    });
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  public show = false;
  public filterCategories = [];
  /**
   * On init
   */
  center: google.maps.LatLngLiteral;

  public countryZipCodes = "";
  public cityZipCodes = "";

  public countryCustom: any;
  public cityCustom: any;

  public PostalCodeCustomArray = [];
  public postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
  public CountriesAddCustomArray = [];
  public CitiesAddCustomArray = [];
  public callFinishGetCategories = false;
  getAllCategories() {
    this.userService
      .getSellerCategoriesWithSubCategories(this.userId)
      .subscribe({
        next: (res: any) => {
          this.sellerCategories = res[0]["results"];
          this.sellerCategories.forEach((element) => {
            if (this.filterCategories.length <= 0) {
              let item = element.category;
              item["subcategory"] = [];
              item["subcategory"].push(element.subcategory);
              this.filterCategories.push(item);
            } else {
              let matchAdded = false;
              this.filterCategories.forEach((item) => {
                if (item._id === element.category._id) {
                  matchAdded = true;
                  item["subcategory"].push(element.subcategory);
                }
              });
              if (!matchAdded) {
                let item = element.category;
                item["subcategory"] = [];
                item["subcategory"].push(element.subcategory);
                this.filterCategories.push(item);
              }
            }
          });
          this.callFinishGetCategories = true;
        },
      });
  }

  // getAllCategories() {
  //   this.userService
  //     .getSellerCategoriesWithSubCategories(this.userId)
  //     .subscribe({
  //       next: (res: any) => {
  //         this.sellerCategories = res[0]["results"];

  //         this.sellerCategories.forEach((element) => {

  //           if (!element.subcategory.isDisabled) {

  //             let categoryAdded = false;

  //             if (this.filterCategories.length <= 0) {

  //               let item = element.category;
  //               item["subcategory"] = [element.subcategory];
  //               this.filterCategories.push(item);
  //             } else {

  //               this.filterCategories.forEach((item) => {
  //                 if (item._id === element.category._id) {

  //                   item["subcategory"].push(element.subcategory);
  //                   categoryAdded = true;
  //                 }
  //               });

  //               if (!categoryAdded) {
  //                 let item = element.category;
  //                 item["subcategory"] = [element.subcategory];
  //                 this.filterCategories.push(item);
  //               }
  //             }
  //           }
  //         });
  //       },
  //     });
  // }

  ngOnInit() {
    this.getAllCategories();
    this.getUserAllZipCodes();
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
      headerTitle: "Home",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Sample",
            isLink: false,
          },
        ],
      },
    };
    this.profileUpdateFormBuilder();
  }

  formatPostalCode(): void {
    // Remove spaces from the current postal code value
    let cleanedPostalCode = this.postalCode.replace(/\s/g, "");

    // Add a space after every 3 characters
    let formattedPostalCode = "";
    for (let i = 0; i < cleanedPostalCode.length; i += 3) {
      formattedPostalCode += cleanedPostalCode.substr(i, 3) + " ";
    }

    // Trim any extra spaces at the end
    this.postalCode = formattedPostalCode.trim();
  }

  formatPostalCodeCustom(): void {
    // Remove spaces from the current postal code value
    let cleanedPostalCode = this.postalCodeCustom.replace(/\s/g, "");

    // Add a space after every 3 characters
    let formattedPostalCode = "";
    for (let i = 0; i < cleanedPostalCode.length; i += 3) {
      formattedPostalCode += cleanedPostalCode.substr(i, 3) + " ";
    }

    // Trim any extra spaces at the end
    this.postalCodeCustom = formattedPostalCode.trim();
  }

  zipCodesGet(city: string, country: string, radius: string) {
    const address = `${city}, ${country}`;
    const apiKey = "AIzaSyC1PD_A1j--Aw4F0iRkC5KZsoxexw6mpnI";

    this.http
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: address,
          key: apiKey,
        },
      })
      .subscribe({
        next: (response: any) => {
          const location = response.results[0].geometry.location;
          return this.getZipCodesByLocation(location, radius, apiKey);
        },
      });
  }

  private getZipCodesByLocation(location: any, radius: string, apiKey: string) {
    this.http
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          latlng: `${location.lat},${location.lng}`,
          result_type: "postal_code",
          location_type: "ROOFTOP",
          radius: radius,
          key: apiKey,
        },
      })
      .subscribe({
        next: (response: any) => {
          const zipCodes = response.results.map(
            (result) =>
              result.address_components.find((component) =>
                component.types.includes("postal_code")
              ).long_name
          );
        },
      });
  }

  getUserAllZipCodes() {
    const OBJ = {
      userId: this.userId,
    };

    this.progressProfileStart = true;
    this.progressProfile = 1;

    // Create a subject to signal when the API call is complete
    const apiResponse$ = new Subject<void>();

    // Simulate progress until API response is received
    const progressSimulator$ = interval(1000).pipe(takeUntil(apiResponse$));

    progressSimulator$.subscribe((value) => {
      // Increment progress until 100
      this.progressProfile = Math.min(value + 1, 100); // Ensure progress doesn't exceed 100
    });

    this.userService
      .getUserZipCodes(OBJ)
      .pipe(takeUntil(apiResponse$))
      .subscribe({
        next: (res) => {
          if (res.data == null || res.data == "null" || res.data == "") {
            this.userSavedZipCodes = "";
          } else {
            this.userSavedZipCodes = res.data.nearByPostalCodes;
          }

          this.getUserAllProfile();

          apiResponse$.next();
          apiResponse$.complete();
          // Optionally, set progress to 100 once the response is complete
          this.progressProfile = 100;
          setTimeout(() => {
            this.progressProfileStart = false;
            this.progressProfile = 0;
          }, 500);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onCountryPhoneCode(code: any) {
    this.phoneCode = code.dial_code;
  }

  getUserAllProfile() {
    // this.nearByZipCodesCount = 0
    // this.nearByZipCodes = [];

    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {
        this.sellerProfile = res;
        this.searchTypeFind = this.sellerProfile.postalCodeSearchType;
        this.customPostalCodeFromPofile = this.sellerProfile.customPostalCodes;

        if (this.sellerProfile.customCountry.length !== 0) {
          this.CountriesAddCustomArray = this.sellerProfile.customCountry;

          if (this.sellerProfile.customCountry[0] == "") {
            this.CountriesAddCustomArray = [];
          }
        }

        if (this.sellerProfile.customCity.length !== 0) {
          this.CitiesAddCustomArray = this.sellerProfile.customCity;

          if (this.sellerProfile.customCountry[0] == "") {
            this.CitiesAddCustomArray = [];
          }
        }

        if (this.sellerProfile.customPostalCodes !== " ") {
          this.PostalCodeCustomArray =
            this.sellerProfile.customPostalCodes.split(",");

          if (this.sellerProfile.customCountry[0] == "") {
            this.PostalCodeCustomArray = [];
          }
        }
        if (this.sellerProfile.postalCode) {
          this.postalCode = this.sellerProfile.postalCode.trim();
        }
        if (this.userSavedZipCodes) {
          let arr = this.userSavedZipCodes.split(",");
          this.nearByZipCodesCount = arr.length;

          this.nearByZipCodes = this.userSavedZipCodes.split(",");
        }
        if (this.sellerProfile.radius) {
          if (this.sellerProfile.customPostalCodes !== " ") {
            this.sliderWithNgModel = parseInt("1");
          } else {
            this.sliderWithNgModel = parseInt(this.sellerProfile.radius);
          }
        }

        if (
          this.sellerProfile.savedLat == 1 ||
          this.sellerProfile.savedLat < 1
        ) {
          this.getLocation();
        } else {
          this.searchedLat = this.sellerProfile.savedLat;
          this.searchedLon = this.sellerProfile.savedLon;

          this.mapCircleCenter = {
            lat: this.sellerProfile.savedLat,
            lng: this.sellerProfile.savedLon,
          };
          this.mapCircleOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            radius: this.sliderWithNgModel * 1609.34,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            draggable: true,
            center: {
              lat: this.sellerProfile.savedLat,
              lng: this.sellerProfile.savedLon,
            },
          };
          this.markerCirclePolygonCenter = {
            lat: this.sellerProfile.savedLat,
            lng: this.sellerProfile.savedLon,
          };
        }

        this.searchedLat = 0;
        this.searchedLon = 0;

        this.profileUpdateFormBuilder();
      },
    });
    // this.selectBasicMethod();
    // this.userService.getAllCategoriesWithSubCategories().subscribe({
    //   next: (res: any)=>{
    //     this.categories = res[0]['results'];
    //   }
    // })

    this.getAllSellerServiceImages();

    this.contentHeader = {
      headerTitle: "Dashboard",
      actionButton: true,
      headerRight: false,
    };
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {
        this.sellerProfile = res;
        this.profileUpdateFormBuilder();
      },
    });
    // this.profileUpdateFormBuilder();

    this.userService.getAllCategoriesWithSubCategories().subscribe({
      next: (res: any) => {
        const CATEGORIES = res[0]["results"];
        const FILTER_CATEGORIES = CATEGORIES.filter(
          (item) => item.title != "Hotels & Travel"
        );
        this.categories = FILTER_CATEGORIES;
      },
    });
  }

  onSubmitSearch() {
    const Text = this.searchText;
    this.http
      .get(`https://services.moventag.com/category/getAllSubCategory?q=${Text}`)
      .subscribe({
        next: (res: any) => {
          this.searchSubCategories = res;
          console.log(this.searchSubCategories);
        },
      });
  }

  onSubmitClear() {
    this.searchText = "";
    this.searchSubCategories = [];
  }

  modalOpenVC(modalVC) {
    this.myFiles = [];
    this.modalService.open(modalVC, {
      centered: true,
      size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCProfilePic(modalVCProfilePic) {
    this.modalService.open(modalVCProfilePic, {
      centered: true,
      size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCCover(modalVCCover) {
    this.modalService.open(modalVCCover, {
      centered: true,
      size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCChangePass(modalVCChangePass) {
    this.modalService.open(modalVCChangePass, {
      centered: true,
      size: "sm", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCContactDet(modalVCContactDet) {
    this.modalService.open(modalVCContactDet, {
      centered: true,
      size: "sm", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCAbout(modalVCAbout) {
    this.modalService.open(modalVCAbout, {
      centered: true,
      size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalOpenImageZoom(modalImage, path) {
    this.selectedServiceImage = path;
    this.modalService.open(modalImage, {
      centered: true,
      size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalOpenVCCategories(modalVCCategories) {
    this.selectedOption = 1;
    this.modalService.open(modalVCCategories, {
      centered: true,
      size: "xl", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
    // this.getLocation();
  }
  profileUpdateFormBuilder() {
    this.profileUpdateForm = this._formBuilder.group({
      companyName: [
        this.sellerProfile?.companyName ? this.sellerProfile.companyName : "",
        [Validators.required],
      ],
      description: [
        this.sellerProfile?.description ? this.sellerProfile.description : "",
        [Validators.required],
      ],
      termsConditions: [
        this.sellerProfile?.termsConditions
          ? this.sellerProfile.termsConditions
          : "",
        [Validators.required],
      ],
      companyType: [
        this.sellerProfile?.companyType ? this.sellerProfile.companyType : "",
        Validators.required,
      ],
      noOfEmployee: [
        this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : "",
        Validators.required,
      ],
      returnPolicy: [
        this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : "",
        Validators.required,
      ],
      liabilityInsurance: [
        this.sellerProfile?.liabilityInsurance
          ? this.sellerProfile.liabilityInsurance
          : false,
        Validators.required,
      ],
      workerCompensation: [
        this.sellerProfile?.workerCompensation
          ? this.sellerProfile.workerCompensation
          : false,
        Validators.required,
      ],
      projectMinimum: [
        this.sellerProfile?.projectMinimum
          ? this.sellerProfile.projectMinimum
          : "",
        Validators.required,
      ],
      bonded: [
        this.sellerProfile?.bonded
          ? this.sellerProfile.bonded == "false"
            ? ""
            : this.sellerProfile.bonded
          : "",
        Validators.required,
      ],
      writtenContract: [
        this.sellerProfile?.writtenContract
          ? this.sellerProfile.writtenContract
          : false,
        Validators.required,
      ],
      address: [
        this.sellerProfile?.address ? this.sellerProfile.address : "",
        Validators.required,
      ],
      postalCode: [
        this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : "",
        Validators.required,
      ],
      paymentMethod: [
        this.sellerProfile?.paymentMethod
          ? this.sellerProfile.paymentMethod
          : "",
        Validators.required,
      ],
      warrantyTerms: [
        this.sellerProfile?.warrantyTerms
          ? this.sellerProfile.warrantyTerms
          : "",
        Validators.required,
      ],
      country: [
        this.sellerProfile?.country ? this.sellerProfile.country : "",
        Validators.required,
      ],
      state: [
        this.sellerProfile?.state ? this.sellerProfile.state : "",
        Validators.required,
      ],
      city: [
        this.sellerProfile?.city ? this.sellerProfile.city : "",
        Validators.required,
      ],
    });

    this.profileUpdateForm.get("postalCode").valueChanges.subscribe((value) => {
      this.formatPostalCodeProfile(value);
    });

    this.sellerWebLinksForm = this._formBuilder.group({
      webURL: [this.sellerProfile?.webURL ? this.sellerProfile.webURL : ""],
      facebookURL: [
        this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : "",
      ],
      instagramURL: [
        this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : "",
      ],
      twitterURL: [
        this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : "",
      ],
      phone: [
        this.sellerProfile?.phone ? this.sellerProfile.phone : "",
        Validators.required,
      ],
      userEmail: [this.sellerProfile?.email ? this.sellerProfile.email : ""],
    });
  }

  formatPostalCodeProfile(value: string): void {
    // Remove spaces from the current postal code value
    let cleanedPostalCode = value.replace(/\s/g, "");

    // Add a space after every 3 characters
    let formattedPostalCode = "";
    for (let i = 0; i < cleanedPostalCode.length; i += 3) {
      formattedPostalCode += cleanedPostalCode.substr(i, 3) + " ";
    }

    // Trim any extra spaces at the end
    this.profileUpdateForm
      .get("postalCode")
      .setValue(formattedPostalCode.trim(), { emitEvent: false });
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

    const ensureHttps = (url: string): string => {
      if (!url) return "";

      if (!url.startsWith("http")) {
        return `https://${url.replace(/^(www\.)?/, "")}`;
      }
      return `https://${url.replace(/^https?:\/\//, "").replace(/^www\./, "")}`;
    };

    const formatPhoneNumber = (phone: string): string => {
      if (!phone) return "";

      // Remove any existing "+1" or other "+" codes and then add "+1" at the start
      return `+1${phone.replace(/^\+1+/, "").replace(/^\+/, "")}`;
    };

    const OBJ = {
      facebookURL: ensureHttps(this.sellerWebLinksForm.value.facebookURL),
      instagramURL: ensureHttps(this.sellerWebLinksForm.value.instagramURL),
      phone: formatPhoneNumber(this.sellerWebLinksForm.value.phone),
      twitterURL: ensureHttps(this.sellerWebLinksForm.value.twitterURL),
      webURL: ensureHttps(this.sellerWebLinksForm.value.webURL),

      companyName: this.sellerProfile?.companyName,
      description: this.sellerProfile?.description,
      termsConditions: this.sellerProfile?.termsConditions,
      companyType: this.sellerProfile?.companyType,
      noOfEmployee: this.sellerProfile?.noOfEmployee,
      returnPolicy: this.sellerProfile?.returnPolicy,
      liabilityInsurance: this.sellerProfile?.liabilityInsurance,
      workerCompensation: this.sellerProfile?.workerCompensation,
      projectMinimum: this.sellerProfile?.projectMinimum,
      bonded: this.sellerProfile?.bonded,
      writtenContract: this.sellerProfile?.writtenContract,
      address: this.sellerProfile?.address,
      postalCode: this.sellerProfile?.postalCode,
      paymentMethod: this.sellerProfile?.paymentMethod,
      warrantyTerms: this.sellerProfile?.warrantyTerms,
      country: this.sellerProfile?.country,
      state: this.sellerProfile?.state,
      city: this.sellerProfile?.city,
    };

    let data = OBJ;
    data["id"] = this.userId;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.modalService.dismissAll();

        this.getUserAllZipCodes();

        // this.sellerProfile = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  modalEditDetail(modalEditDetail) {
    this.modalService.open(modalEditDetail, {
      centered: true,
      size: "xl", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalUpdateCategory(modalUpdateCategory) {
    this.modalService.open(modalUpdateCategory, {
      centered: true,
      size: "xl", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalUpdatePhoto(modalUpdatePhoto) {
    this.coverPhotoChangedEvent = "";
    this.coverPhotoCroppedImage = "";
    this.companyPhotoChangedEvent = "";
    this.CompanyPhotoCroppedImage = "";
    this.servicePhotoChangedEvent = "";
    this.servicePhotoCroppedImage = "";
    this.coverPhotoCroppedImageFile = null;
    this.CompanyPhotoCroppedImageFile = null;
    this.servicePhotoCroppedImageFile = null;
    this.modalService.open(modalUpdatePhoto, {
      centered: true,
      size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  coverPhotoChangedEvent: any = "";
  coverPhotoCroppedImage: any = "";
  coverPhotoCroppedImageFile: any;

  companyPhotoChangedEvent: any = "";
  CompanyPhotoCroppedImage: any = "";
  CompanyPhotoCroppedImageFile: any;

  servicePhotoChangedEvent: any = "";
  servicePhotoCroppedImage: any = "";
  servicePhotoCroppedImageFile: any;

  coverfileChangeEvent(event: any): void {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      this.toastrService.error("Please upload a file under 2 MB");
      return;
    }
    this.coverPhotoChangedEvent = event;
  }

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files?.length) {
      const file = event.dataTransfer.files[0];
      const fakeEvent = {
        target: { files: [file] },
      };
      this.coverfileChangeEvent(fakeEvent);
    }
  }

  isDraggingProfileIMG = false;

  onDragOverProfileIMG(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingProfileIMG = true;
  }

  onDragLeaveProfileIMG(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingProfileIMG = false;
  }

  onDropProfileIMG(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingProfileIMG = false;

    if (event.dataTransfer?.files?.length) {
      const file = event.dataTransfer.files[0];
      const fakeEvent = {
        target: { files: [file] },
      };
      this.companyfileChangeEvent(fakeEvent);
    }
  }

  coverimageCropped(event: ImageCroppedEvent) {
    this.coverPhotoCroppedImage = event.base64;
    this.coverPhotoCroppedImageFile = base64ToFile(this.coverPhotoCroppedImage);
  }
  companyfileChangeEvent(event: any): void {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      this.toastrService.error("Please upload a file under 2 MB");
      return;
    }

    this.companyPhotoChangedEvent = event;
  }

  servicefileChangeEvent(event: any): void {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      this.toastrService.error("Please upload a file under 2 MB");
      return;
    }
    this.servicePhotoChangedEvent = event;
  }

  companyimageCropped(event: ImageCroppedEvent) {
    this.CompanyPhotoCroppedImage = event.base64;
    this.CompanyPhotoCroppedImageFile = base64ToFile(
      this.CompanyPhotoCroppedImage
    );
  }

  serviceImageCropped(event: ImageCroppedEvent) {
    this.servicePhotoCroppedImage = event.base64;
    this.servicePhotoCroppedImageFile = base64ToFile(
      this.servicePhotoCroppedImage
    );
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
    data["id"] = this.userId;

    const OBJ = {
      address: data.address,
      bonded: data.bonded,
      city: data.city,
      companyName: data.companyName,
      companyType: data.companyType,
      country: data.country,
      description: data.description,
      id: data.id,
      liabilityInsurance: data.liabilityInsurance,
      noOfEmployee: data.noOfEmployee,
      paymentMethod: data.paymentMethod,
      postalCode: data.postalCode.toUpperCase(),
      projectMinimum: data.projectMinimum,
      returnPolicy: data.returnPolicy,
      state: data.state,
      termsConditions: data.termsConditions,
      warrantyTerms: data.warrantyTerms,
      workerCompensation: data.workerCompensation,
      writtenContract: data.writtenContract,

      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,
    };

    this.authenticationSerive.updateProfile(OBJ).subscribe({
      next: (res) => {
        console.log(res);
        this.modalService.dismissAll();

        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSaveNearByZipCode() {
    this.submitted = true;

    if (this.postalCode === "" || this.nearByZipCodes.length <= 0) {
      return;
    }

    let data = {};

    data["postalCode"] = this.postalCode;
    data["radius"] = this.sliderWithNgModel;
    data["nearByPostalCodes"] = this.nearByZipCodes.toString();
    data["id"] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "NearBy",
      postalCode: this.postalCode,
      radius: this.sliderWithNgModel,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      countryZipCodes: this.countryZipCodes,
      cityZipCodes: this.cityZipCodes,

      customCountry: [],
      customCity: [],

      id: this.userId,

      savedLat: this.searchedLat,
      savedLon: this.searchedLon,
    };

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.saveUserZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveUserZipCodes() {
    const OBJ = {
      userId: this.userId,
      nearByPostalCodes: this.nearByZipCodes.toString(),
    };

    this.progressStart = true;
    this.progress = 1;

    let queryParam =
      "?zipcode=" +
      this.postalCode.toUpperCase() +
      "&miles=" +
      this.sliderWithNgModel * 1609.344;

    // Create a subject to signal when the API call is complete
    const apiResponse$ = new Subject<void>();

    // Simulate progress until API response is received
    const progressSimulator$ = interval(1000).pipe(takeUntil(apiResponse$));

    progressSimulator$.subscribe((value) => {
      // Increment progress until 100
      this.progress = Math.min(value + 1, 100); // Ensure progress doesn't exceed 100
    });

    this.userService
      .createUserZipCodes(OBJ)
      .pipe(takeUntil(apiResponse$))
      .subscribe({
        next: (res) => {
          this.modalService.dismissAll();

          this.getUserAllZipCodes();

          this.postalCodeCustom = "";
          this.PostalCodeCustomArray = [];
          this.countryCustom = null;
          this.cityCustom = null;
          this.CountriesAddCustomArray = [];
          this.CitiesAddCustomArray = [];

          this.toastrService.success("Added Successfully!");

          apiResponse$.next();
          apiResponse$.complete();
          // Optionally, set progress to 100 once the response is complete
          this.progress = 100;
          setTimeout(() => {
            this.progressStart = false;
            this.progress = 0;
          }, 500);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  uploadCoverPhoto() {
    if (this.coverPhotoCroppedImageFile) {
      let data: FormData = new FormData();
      data.append("coverImage", this.coverPhotoCroppedImageFile, "image/png");

      data.append(
        "facebookURL",
        this.sellerProfile?.facebookURL === undefined
          ? ""
          : this.sellerProfile.facebookURL
      );
      data.append(
        "instagramURL",
        this.sellerProfile?.instagramURL === undefined
          ? ""
          : this.sellerProfile.instagramURL
      );
      data.append(
        "phone",
        this.sellerProfile?.phone === undefined ? "" : this.sellerProfile.phone
      );
      data.append(
        "twitterURL",
        this.sellerProfile?.twitterURL === undefined
          ? ""
          : this.sellerProfile.twitterURL
      );
      data.append(
        "webURL",
        this.sellerProfile?.webURL === undefined
          ? ""
          : this.sellerProfile.webURL
      );

      data.append(
        "companyName",
        this.sellerProfile?.companyName === undefined
          ? ""
          : this.sellerProfile.companyName
      );
      data.append(
        "description",
        this.sellerProfile?.description === undefined
          ? ""
          : this.sellerProfile.description
      );
      data.append(
        "termsConditions",
        this.sellerProfile?.termsConditions === undefined
          ? ""
          : this.sellerProfile.termsConditions
      );
      data.append(
        "companyType",
        this.sellerProfile?.companyType === undefined
          ? ""
          : this.sellerProfile.companyType
      );
      data.append(
        "noOfEmployee",
        this.sellerProfile?.noOfEmployee === undefined
          ? ""
          : this.sellerProfile.noOfEmployee
      );
      data.append(
        "returnPolicy",
        this.sellerProfile?.returnPolicy === undefined
          ? ""
          : this.sellerProfile.returnPolicy
      );
      data.append(
        "liabilityInsurance",
        this.sellerProfile?.liabilityInsurance === undefined
          ? ""
          : this.sellerProfile.liabilityInsurance
      );
      data.append(
        "workerCompensation",
        this.sellerProfile?.workerCompensation === undefined
          ? ""
          : this.sellerProfile.workerCompensation
      );
      data.append(
        "projectMinimum",
        this.sellerProfile?.projectMinimum === undefined
          ? ""
          : this.sellerProfile.projectMinimum
      );
      data.append(
        "bonded",
        this.sellerProfile?.bonded === undefined
          ? ""
          : this.sellerProfile.bonded
      );
      data.append(
        "writtenContract",
        this.sellerProfile?.writtenContract === undefined
          ? ""
          : this.sellerProfile.writtenContract
      );
      data.append(
        "address",
        this.sellerProfile?.address === undefined
          ? ""
          : this.sellerProfile.address
      );
      data.append(
        "postalCode",
        this.sellerProfile?.postalCode === undefined
          ? ""
          : this.sellerProfile.postalCode
      );
      data.append(
        "paymentMethod",
        this.sellerProfile?.paymentMethod === undefined
          ? ""
          : this.sellerProfile.paymentMethod
      );
      data.append(
        "warrantyTerms",
        this.sellerProfile?.warrantyTerms === undefined
          ? ""
          : this.sellerProfile.warrantyTerms
      );
      data.append(
        "country",
        this.sellerProfile?.country === undefined
          ? ""
          : this.sellerProfile.country
      );
      data.append(
        "state",
        this.sellerProfile?.state === undefined ? "" : this.sellerProfile.state
      );
      data.append(
        "city",
        this.sellerProfile?.city === undefined ? "" : this.sellerProfile.city
      );

      data.append("id", this.userId);
      this.userService.updateCoverPhoto(data).subscribe({
        next: (res) => {
          this.modalService.dismissAll();

          this.getUserAllZipCodes();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  uploadProfilePhoto() {
    if (this.CompanyPhotoCroppedImageFile) {
      let data: FormData = new FormData();
      data.append(
        "profileImage",
        this.CompanyPhotoCroppedImageFile,
        "image/png"
      );

      data.append(
        "facebookURL",
        this.sellerProfile?.facebookURL === undefined
          ? ""
          : this.sellerProfile?.facebookURL
      );
      data.append(
        "instagramURL",
        this.sellerProfile?.instagramURL === undefined
          ? ""
          : this.sellerProfile?.instagramURL
      );
      data.append(
        "phone",
        this.sellerProfile?.phone === undefined ? "" : this.sellerProfile?.phone
      );
      data.append(
        "twitterURL",
        this.sellerProfile?.twitterURL === undefined
          ? ""
          : this.sellerProfile?.twitterURL
      );
      data.append(
        "webURL",
        this.sellerProfile?.webURL === undefined
          ? ""
          : this.sellerProfile?.webURL
      );

      data.append(
        "companyName",
        this.sellerProfile?.companyName === undefined
          ? ""
          : this.sellerProfile?.companyName
      );
      data.append(
        "description",
        this.sellerProfile?.description === undefined
          ? ""
          : this.sellerProfile?.description
      );
      data.append(
        "termsConditions",
        this.sellerProfile?.termsConditions === undefined
          ? ""
          : this.sellerProfile?.termsConditions
      );
      data.append(
        "companyType",
        this.sellerProfile?.companyType === undefined
          ? ""
          : this.sellerProfile?.companyType
      );
      data.append(
        "noOfEmployee",
        this.sellerProfile?.noOfEmployee === undefined
          ? ""
          : this.sellerProfile?.noOfEmployee
      );
      data.append(
        "returnPolicy",
        this.sellerProfile?.returnPolicy === undefined
          ? ""
          : this.sellerProfile?.returnPolicy
      );
      data.append(
        "liabilityInsurance",
        this.sellerProfile?.liabilityInsurance === undefined
          ? ""
          : this.sellerProfile?.liabilityInsurance
      );
      data.append(
        "workerCompensation",
        this.sellerProfile?.workerCompensation === undefined
          ? ""
          : this.sellerProfile?.workerCompensation
      );
      data.append(
        "projectMinimum",
        this.sellerProfile?.projectMinimum === undefined
          ? ""
          : this.sellerProfile?.projectMinimum
      );
      data.append(
        "bonded",
        this.sellerProfile?.bonded === undefined
          ? ""
          : this.sellerProfile?.bonded
      );
      data.append(
        "writtenContract",
        this.sellerProfile?.writtenContract === undefined
          ? ""
          : this.sellerProfile?.writtenContract
      );
      data.append(
        "address",
        this.sellerProfile?.address === undefined
          ? ""
          : this.sellerProfile?.address
      );
      data.append(
        "postalCode",
        this.sellerProfile?.postalCode === undefined
          ? ""
          : this.sellerProfile?.postalCode
      );
      data.append(
        "paymentMethod",
        this.sellerProfile?.paymentMethod === undefined
          ? ""
          : this.sellerProfile?.paymentMethod
      );
      data.append(
        "warrantyTerms",
        this.sellerProfile?.warrantyTerms === undefined
          ? ""
          : this.sellerProfile?.warrantyTerms
      );
      data.append(
        "country",
        this.sellerProfile?.country === undefined
          ? ""
          : this.sellerProfile?.country
      );
      data.append(
        "state",
        this.sellerProfile?.state === undefined ? "" : this.sellerProfile?.state
      );
      data.append(
        "city",
        this.sellerProfile?.city === undefined ? "" : this.sellerProfile?.city
      );

      data.append("id", this.userId);
      this.authenticationSerive.updateProfile(data).subscribe({
        next: (res) => {
          this.modalService.dismissAll();

          this.getUserAllZipCodes();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  uploadServicePhotos() {
    const formData = new FormData();
    formData.append(
      "servicePhotos",
      this.servicePhotoCroppedImageFile,
      "image/png"
    );
    formData.append("id", this.userId);
    this.userService.addUserSerivesPhotos(formData).subscribe((res) => {
      this.modalService.dismissAll();
      this.getAllSellerServiceImages();
    });
  }

  public findCheckOrNot(id) {
    let findIdExists = this.sellerCategories.find(
      (elem) => elem.subCategoryId === id
    );
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
    const latLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: latLng,
      zoom: 10,
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
      if (status === "OK") {
        const addressComponents = results[0].address_components;
        this.postalCode = addressComponents.find((component) =>
          component.types.includes("postal_code")
        ).long_name;
        // this.getZipCodes(this.map, latLng, this.sliderWithNgModel);

        // Do something with the zipCode value
      }
    });

    // Extract the postal codes from the nearby locations
    this.mapCircleCenter = { lat: latLng.lat(), lng: latLng.lng() };
    this.mapCircleOptions = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      radius: this.sliderWithNgModel * 1609.34,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      draggable: true,
      center: { lat: latLng.lat(), lng: latLng.lng() },
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

  selectOption(event) {
    this.selectedOption = event;
  }

  callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
        });
      }
    }
  }

  validatePostalCode(postalCode: string): boolean {
    return this.postalCodePattern.test(postalCode);
  }

  public clicOnItem(item) {
    const index = this.PostalCodeCustomArray.indexOf(item);
    if (index > -1) {
      this.PostalCodeCustomArray.splice(index, 1);
    }

    this.submitted = true;
    // stop here if form is invalid

    let data = {};

    data["postalCode"] = "";
    data["radius"] = 0;
    data["nearByPostalCodes"] = this.PostalCodeCustomArray.toString();
    data["id"] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "Custom",
      postalCode: " ",
      radius: 0,
      customPostalCodes: this.PostalCodeCustomArray.toString(),
      nearByPostalCodes: this.PostalCodeCustomArray.toString(),

      customCountry: [],
      customCity: [],

      savedLat: 1,
      savedLon: 1,

      id: this.userId,
    };

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public addCustomPostaCodeToArray() {
    if (!this.postalCodeCustom) {
      this.toastrService.error("Please enter valid postal code.");
      return;
    }
    if (!this.validatePostalCode(this.postalCodeCustom)) {
      this.toastrService.error(
        "Please enter valid postal code. \n e.g A1A 1A1"
      );
      return;
    }

    var searchArray =
      this.PostalCodeCustomArray.indexOf(
        this.postalCodeCustom.toLocaleUpperCase()
      ) > -1;

    if (searchArray == true) {
      this.toastrService.error("Already Added");
      return;
    }

    const ARRAY = [];
    ARRAY.push(
      ...this.PostalCodeCustomArray,
      this.postalCodeCustom.toLocaleUpperCase()
    );
    this.PostalCodeCustomArray = ARRAY;
  }

  onCountryChangeCustom(country: any) {
    this.cityCustom = null;

    this.countryCustom = country;
    let city = this.countriesData.filter((state) => state.country === country);
    city = [...new Set(city.map((item) => item.name))];
    city.sort();
    this.countryCitiesCustom = city;
  }

  onCityChangeCustom(city: any) {
    this.cityCustom = city;
  }

  public addCustomCountryCityToArray() {
    if (!this.countryCustom) {
      this.toastrService.error("Please add country first.");
      return;
    }

    if (!this.cityCustom) {
      var searchArray =
        this.CountriesAddCustomArray.indexOf(
          this.countryCustom.toLocaleUpperCase()
        ) > -1;

      if (searchArray == true) {
        this.toastrService.error("Country Already Added");
        return;
      }

      const ARRAY = [];
      ARRAY.push(
        ...this.CountriesAddCustomArray,
        this.countryCustom.toLocaleUpperCase()
      );
      this.CountriesAddCustomArray = ARRAY;
    } else {
      var searchArray =
        this.CountriesAddCustomArray.indexOf(
          this.countryCustom.toLocaleUpperCase()
        ) > -1;
      // var searchArrayCity = (this.CitiesAddCustomArray.indexOf(this.cityCustom.toLocaleUpperCase()) > -1);
      var searchArrayCity = this.CitiesAddCustomArray.filter(
        (item) => item.city == this.cityCustom.toLocaleUpperCase()
      );

      if (searchArray == true) {
        if (searchArrayCity.length > 0) {
          this.toastrService.error("City Already Added");
          return;
        }

        const ARRAY_CITY = [];
        const OBJ = {
          country: this.countryCustom.toLocaleUpperCase(),
          city: this.cityCustom.toLocaleUpperCase(),
        };
        ARRAY_CITY.push(...this.CitiesAddCustomArray, OBJ);

        const compareObjects = (obj1: any, obj2: any) => {
          return obj1.country === obj2.country && obj1.city === obj2.city;
        };

        let uniqueArrayOfObjects = ARRAY_CITY.filter(
          (value, index, self) =>
            self.findIndex((obj) => compareObjects(obj, value)) === index
        );

        this.CitiesAddCustomArray = uniqueArrayOfObjects;
      }

      if (searchArrayCity.length > 0) {
        this.toastrService.error("City Already Added");
        return;
      }

      const ARRAY_COUNTRY = [];
      ARRAY_COUNTRY.push(
        ...this.CountriesAddCustomArray,
        this.countryCustom.toLocaleUpperCase()
      );
      let uniqueArrayCountry = [...new Set(ARRAY_COUNTRY)];
      this.CountriesAddCustomArray = uniqueArrayCountry;

      const ARRAY_CITY = [];
      const OBJ = {
        country: this.countryCustom.toLocaleUpperCase(),
        city: this.cityCustom.toLocaleUpperCase(),
      };
      ARRAY_CITY.push(...this.CitiesAddCustomArray, OBJ);
      const compareObjects = (obj1: any, obj2: any) => {
        return obj1.country === obj2.country && obj1.city === obj2.city;
      };

      let uniqueArrayOfObjects = ARRAY_CITY.filter(
        (value, index, self) =>
          self.findIndex((obj) => compareObjects(obj, value)) === index
      );

      this.CitiesAddCustomArray = uniqueArrayOfObjects;
    }
  }

  public removeCustomCountry(item) {
    const index = this.CountriesAddCustomArray.indexOf(item);
    if (index > -1) {
      this.CountriesAddCustomArray.splice(index, 1);
    }

    for (let i = this.CitiesAddCustomArray.length - 1; i >= 0; i--) {
      if (this.CitiesAddCustomArray[i].country === item) {
        this.CitiesAddCustomArray.splice(i, 1);
      }
    }

    this.submitted = true;

    let data = {};

    data["postalCode"] = "";
    data["radius"] = 0;
    data["nearByPostalCodes"] = this.PostalCodeCustomArray.toString();
    data["id"] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "CountryCity",
      postalCode: " ",
      radius: 0,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      customCountry: this.CountriesAddCustomArray,
      customCity: this.CitiesAddCustomArray,

      savedLat: 1,
      savedLon: 1,

      id: this.userId,
    };

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.postalCode = "";
        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.nearByZipCodesCount = 0;
        this.sliderWithNgModel = 1;
        this.nearByZipCodes = [];

        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public removeCustomCity(item) {
    const index = this.CitiesAddCustomArray.indexOf(item);
    if (index > -1) {
      this.CitiesAddCustomArray.splice(index, 1);
    }
    this.submitted = true;

    let data = {};

    data["postalCode"] = "";
    data["radius"] = 0;
    data["nearByPostalCodes"] = this.PostalCodeCustomArray.toString();
    data["id"] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "CountryCity",
      postalCode: " ",
      radius: 0,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      customCountry: this.CountriesAddCustomArray,
      customCity: this.CitiesAddCustomArray,

      savedLat: 1,
      savedLon: 1,

      id: this.userId,
    };

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.postalCode = "";
        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.nearByZipCodesCount = 0;
        this.sliderWithNgModel = 1;
        this.nearByZipCodes = [];

        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSaveCustomCountriescities() {
    if (this.CountriesAddCustomArray.length < 1) {
      this.toastrService.error("Please add country first.");
      return;
    }

    const CITIES = [];
    this.CitiesAddCustomArray.map((item) => {
      CITIES.push(item.city);
    });

    setTimeout(() => {
      this.saveCustomCitiesCountries();
    }, 1000);
  }

  saveCustomCitiesCountries() {
    this.submitted = true;

    let data = {};

    data["postalCode"] = "";
    data["radius"] = 0;
    data["nearByPostalCodes"] = this.PostalCodeCustomArray.toString();
    data["id"] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      savedLat: 1,
      savedLon: 1,

      postalCodeSearchType: "CountryCity",
      postalCode: " ",
      radius: 0,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      customCountry: this.CountriesAddCustomArray,
      customCity: this.CitiesAddCustomArray,

      id: this.userId,
    };

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.modalService.dismissAll();

        this.postalCode = "";
        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.nearByZipCodesCount = 0;
        this.sliderWithNgModel = 1;
        this.nearByZipCodes = [];

        this.searchedLat = 0;
        this.searchedLon = 0;

        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSaveCustomPostalCode() {
    if (this.PostalCodeCustomArray.length < 1) {
      this.toastrService.error("Please enter postal code.");
      return;
    }

    if (!this.postalCodeCustom) {
      this.toastrService.error("Please enter postal code.");
      return;
    }

    this.submitted = true;
    // stop here if form is invalid

    let data = {};

    data["postalCode"] = "";
    data["radius"] = 0;
    data["nearByPostalCodes"] = this.PostalCodeCustomArray.toString();
    data["id"] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "Custom",
      postalCode: " ",
      radius: 0,
      customPostalCodes: this.PostalCodeCustomArray.toString(),
      nearByPostalCodes: "",

      customCountry: [],
      customCity: [],

      savedLat: 1,
      savedLon: 1,

      id: this.userId,
    };

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.saveUserZipCodesCustom();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveUserZipCodesCustom() {
    const OBJ = {
      userId: this.userId,
      nearByPostalCodes: this.PostalCodeCustomArray.toString(),
    };

    this.userService.createUserZipCodes(OBJ).subscribe({
      next: (res) => {
        this.modalService.dismissAll();

        this.countryCustom = null;
        this.cityCustom = null;
        this.CountriesAddCustomArray = [];
        this.CitiesAddCustomArray = [];

        this.getUserAllZipCodes();
        this.toastrService.success("Added Successfully!");
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public findNearByPostalCode() {
    // if (!this.countryZipCodes) {
    //   this.toastrService.error('Please select country')
    //   return;
    // }

    // if (!this.cityZipCodes) {
    //   this.toastrService.error('Please select city')
    //   return;
    // }

    if (!this.postalCode) {
      this.toastrService.error("Please enter postal code.");
      return;
    }

    // this.zipCodesGet(this.cityZipCodes, this.countryZipCodes, `${this.sliderWithNgModel * 1000}`);
    // return;

    this.searchTypeFind = "NearBy";
    this.nearByZipCodesCount = 0;
    this.nearByZipCodes = [];

    this.progressStart = true;
    this.progress = 1;

    let queryParam =
      "?zipcode=" +
      this.postalCode.toUpperCase() +
      "&miles=" +
      this.sliderWithNgModel * 1609.344;

    // Create a subject to signal when the API call is complete
    const apiResponse$ = new Subject<void>();

    // Simulate progress until API response is received
    const progressSimulator$ = interval(1000).pipe(takeUntil(apiResponse$));

    progressSimulator$.subscribe((value) => {
      // Increment progress until 100
      this.progress = Math.min(value + 1, 100); // Ensure progress doesn't exceed 100
    });

    this.http
      .get(
        `${environment.apiUrl}seller-category/get-nearby-zipcode${queryParam}`,
        {
          reportProgress: true,
          observe: "events",
        }
      )
      .pipe(takeUntil(apiResponse$))
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const total = event.total || 1;
            const progress = Math.round((100 * event.loaded) / total);
            // Set progress only if it's less than 100
            if (progress < 100) {
              this.progress = progress;
            }
            // Optionally, you can set the progress to 100 once the API response is complete
            // this.progress = progress;
          } else if (event.type === HttpEventType.Response) {
            const DATA = event.body;

            this.nearByZipCodesCount = DATA["count"];
            this.nearByZipCodes = DATA["result"];

            const LAT = DATA["latitude"];
            const LON = DATA["longitude"];

            this.searchedLat = LAT;
            this.searchedLon = LON;

            this.mapCircleCenter = { lat: LAT, lng: LON };
            this.mapCircleOptions = {
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              radius: this.sliderWithNgModel * 1609.34,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              draggable: true,
              center: { lat: LAT, lng: LON },
            };
            this.markerCirclePolygonCenter = { lat: LAT, lng: LON };

            // Signal that the API response is complete
            apiResponse$.next();
            apiResponse$.complete();
            // Optionally, set progress to 100 once the response is complete
            this.progress = 100;
            setTimeout(() => {
              this.progressStart = false;
              this.progress = 0;
            }, 500);
          }
        },
        (error) => {
          // Handle the error here
          console.error("Error:", error);
          this.progress = 100;
          setTimeout(() => {
            this.progressStart = false;
            this.progress = 0;
          }, 500);
          apiResponse$.error(error); // Notify observers about the error
        }
      );

    // let queryParam = '?zipcode=' + this.postalCode.toUpperCase() + '&miles=' + this.sliderWithNgModel * 1609.344;
    // this.userService.getNearByPostalCode(queryParam)
    //   .subscribe(res => {
    //     this.nearByZipCodesCount = res.count;
    //     this.nearByZipCodes = res.result;

    //   })

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
    this.isReadMore = !this.isReadMore;
  }
  public isReadMoreTerms = true;
  showFullisTerms() {
    this.isReadMoreTerms = !this.isReadMoreTerms;
  }
}
