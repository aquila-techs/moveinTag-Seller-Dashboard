// import { Component, OnInit } from "@angular/core";
// import { environment } from "environments/environment";
// import { UserService } from "@core/services/services/user.service";
// import { ToastrService } from "ngx-toastr";

// @Component({
//   selector: "app-verifications",
//   templateUrl: "./verifications.component.html",
//   styleUrls: ["./verifications.component.scss"],
// })
// export class VerificationsComponent implements OnInit {
//   public baseURL: any = environment.serverURL;

//   constructor(
//     private userService: UserService,
//     private toastrService: ToastrService
//   ) {
//     this.userId = JSON.parse(window.localStorage.getItem("currentUser"))._id;
//   }

//   public userId = "";
//   public sellerProfile: any;

//   public LisenceExtension: "";
//   public LisenceURL: "";

//   public LibilityInsuranceExtension: "";
//   public LibilityInsuranceURL: "";

//   public IdentityCardExtension: "";
//   public IdentityCardURL: "";

//   licensePhotoChangedEvent: any = "";
//   licensePhotoChangedEventTYPE: any = "";
//   libilityInsurancePhotoChangedEvent: any = "";
//   libilityInsurancePhotoChangedEventTYPE: any = "";
//   IdentityCardPhotoChangedEvent: any = "";
//   IdentityCardPhotoChangedEventTYPE: any = "";

//   public licensefileSelected: any;
//   public libilityInsurancefileSelected: any;
//   public IdentityCardfile: any;

//   get_url_extension(url) {
//     return url.split(/[#?]/)[0].split(".").pop().trim();
//   }

//   ngOnInit(): void {
//     this.getUserProfile();
//   }

//   getUserProfile() {
//     this.userService.getProfile(this.userId).subscribe({
//       next: (res: any) => {
//         this.sellerProfile = res;

//         this.LisenceURL = res.license;
//         this.LibilityInsuranceURL = res.libilityInsurance;
//         this.IdentityCardURL = res.IdentityCard;
//       },
//     });
//   }

//   licensefileChangeEvent(event: any): void {
//     if (
//       event.target.files[0].type === "application/pdf" ||
//       event.target.files[0].type === "image/jpeg" ||
//       event.target.files[0].type === "image/png"
//     ) {
//       this.licensefileSelected = event.target.files[0];
//     } else {
//       this.toastrService.error(
//         "Please select correct format of file (PDF, PNG, JPG)"
//       );
//     }
//     return;
//     if (
//       event.target.files[0].type === "application/pdf" ||
//       event.target.files[0].type === "image/jpeg" ||
//       event.target.files[0].type === "image/png"
//     ) {
//       let data: FormData = new FormData();

//       data.append(
//         "companyName",
//         this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
//       );
//       data.append(
//         "description",
//         this.sellerProfile?.description ? this.sellerProfile.description : ""
//       );
//       data.append(
//         "termsConditions",
//         this.sellerProfile?.termsConditions
//           ? this.sellerProfile.termsConditions
//           : ""
//       );
//       data.append(
//         "companyType",
//         this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
//       );
//       data.append(
//         "noOfEmployee",
//         this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
//       );
//       data.append(
//         "returnPolicy",
//         this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
//       );
//       data.append(
//         "liabilityInsurance",
//         this.sellerProfile?.liabilityInsurance
//           ? this.sellerProfile.liabilityInsurance
//           : ""
//       );
//       data.append(
//         "workerCompensation",
//         this.sellerProfile?.workerCompensation
//           ? this.sellerProfile.workerCompensation
//           : ""
//       );
//       data.append(
//         "projectMinimum",
//         this.sellerProfile?.projectMinimum
//           ? this.sellerProfile.projectMinimum
//           : ""
//       );
//       data.append(
//         "bonded",
//         this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
//       );
//       data.append(
//         "writtenContract",
//         this.sellerProfile?.writtenContract
//           ? this.sellerProfile.writtenContract
//           : ""
//       );
//       data.append(
//         "address",
//         this.sellerProfile?.address ? this.sellerProfile.address : ""
//       );
//       data.append(
//         "postalCode",
//         this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
//       );
//       data.append(
//         "paymentMethod",
//         this.sellerProfile?.paymentMethod
//           ? this.sellerProfile.paymentMethod
//           : ""
//       );
//       data.append(
//         "warrantyTerms",
//         this.sellerProfile?.warrantyTerms
//           ? this.sellerProfile.warrantyTerms
//           : ""
//       );
//       data.append(
//         "country",
//         this.sellerProfile?.country ? this.sellerProfile.country : ""
//       );
//       data.append(
//         "state",
//         this.sellerProfile?.state ? this.sellerProfile.state : ""
//       );
//       data.append(
//         "city",
//         this.sellerProfile?.city ? this.sellerProfile.city : ""
//       );
//       data.append(
//         "twitterURL",
//         this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
//       );
//       data.append(
//         "instagramURL",
//         this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
//       );
//       data.append(
//         "facebookURL",
//         this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
//       );

//       data.append("license", event.target.files[0]);
//       data.append("id", this.userId);
//       this.userService.updateSellerLicense(data).subscribe({
//         next: (res) => {
//           this.toastrService.success("File has been updated!");
//           this.getUserProfile();
//         },
//         error: (err) => {
//           this.getUserProfile();
//         },
//       });
//       return;
//     } else {
//       this.toastrService.error(
//         "Please select correct format of file (PDF, PNG, JPG)"
//       );
//     }
//   }

//   libilityInsurancefileChangeEvent(event: any): void {
//     if (
//       event.target.files[0].type === "application/pdf" ||
//       event.target.files[0].type === "image/jpeg" ||
//       event.target.files[0].type === "image/png"
//     ) {
//       this.libilityInsurancefileSelected = event.target.files[0];
//     } else {
//       this.toastrService.error(
//         "Please select correct format of file (PDF, PNG, JPG)"
//       );
//     }
//   }

//   IdentityCardfileChangeEvent(event: any): void {
//     if (
//       event.target.files[0].type === "application/pdf" ||
//       event.target.files[0].type === "image/jpeg" ||
//       event.target.files[0].type === "image/png"
//     ) {
//       this.IdentityCardfile = event.target.files[0];
//     } else {
//       this.toastrService.error(
//         "Please select correct format of file (PDF, PNG, JPG)"
//       );
//     }
//   }

//   licensefileUpload(file) {
//     let data: FormData = new FormData();

//     data.append(
//       "companyName",
//       this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
//     );
//     data.append(
//       "description",
//       this.sellerProfile?.description ? this.sellerProfile.description : ""
//     );
//     data.append(
//       "termsConditions",
//       this.sellerProfile?.termsConditions
//         ? this.sellerProfile.termsConditions
//         : ""
//     );
//     data.append(
//       "companyType",
//       this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
//     );
//     data.append(
//       "noOfEmployee",
//       this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
//     );
//     data.append(
//       "returnPolicy",
//       this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
//     );
//     data.append(
//       "liabilityInsurance",
//       this.sellerProfile?.liabilityInsurance
//         ? this.sellerProfile.liabilityInsurance
//         : ""
//     );
//     data.append(
//       "workerCompensation",
//       this.sellerProfile?.workerCompensation
//         ? this.sellerProfile.workerCompensation
//         : ""
//     );
//     data.append(
//       "projectMinimum",
//       this.sellerProfile?.projectMinimum
//         ? this.sellerProfile.projectMinimum
//         : ""
//     );
//     data.append(
//       "bonded",
//       this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
//     );
//     data.append(
//       "writtenContract",
//       this.sellerProfile?.writtenContract
//         ? this.sellerProfile.writtenContract
//         : ""
//     );
//     data.append(
//       "address",
//       this.sellerProfile?.address ? this.sellerProfile.address : ""
//     );
//     data.append(
//       "postalCode",
//       this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
//     );
//     data.append(
//       "paymentMethod",
//       this.sellerProfile?.paymentMethod ? this.sellerProfile.paymentMethod : ""
//     );
//     data.append(
//       "warrantyTerms",
//       this.sellerProfile?.warrantyTerms ? this.sellerProfile.warrantyTerms : ""
//     );
//     data.append(
//       "country",
//       this.sellerProfile?.country ? this.sellerProfile.country : ""
//     );
//     data.append(
//       "state",
//       this.sellerProfile?.state ? this.sellerProfile.state : ""
//     );
//     data.append(
//       "city",
//       this.sellerProfile?.city ? this.sellerProfile.city : ""
//     );
//     data.append(
//       "twitterURL",
//       this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
//     );
//     data.append(
//       "instagramURL",
//       this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
//     );
//     data.append(
//       "facebookURL",
//       this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
//     );

//     data.append("license", file);
//     data.append("id", this.userId);
//     this.userService.updateSellerLicense(data).subscribe({
//       next: (res) => {
//         this.libilityInsurancefileUpload(this.libilityInsurancefileSelected);
//       },
//       error: (err) => {
//         this.getUserProfile();
//       },
//     });
//     return;
//   }

//   libilityInsurancefileUpload(file) {
//     let data: FormData = new FormData();
//     data.append(
//       "companyName",
//       this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
//     );
//     data.append(
//       "description",
//       this.sellerProfile?.description ? this.sellerProfile.description : ""
//     );
//     data.append(
//       "termsConditions",
//       this.sellerProfile?.termsConditions
//         ? this.sellerProfile.termsConditions
//         : ""
//     );
//     data.append(
//       "companyType",
//       this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
//     );
//     data.append(
//       "noOfEmployee",
//       this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
//     );
//     data.append(
//       "returnPolicy",
//       this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
//     );
//     data.append(
//       "liabilityInsurance",
//       this.sellerProfile?.liabilityInsurance
//         ? this.sellerProfile.liabilityInsurance
//         : ""
//     );
//     data.append(
//       "workerCompensation",
//       this.sellerProfile?.workerCompensation
//         ? this.sellerProfile.workerCompensation
//         : ""
//     );
//     data.append(
//       "projectMinimum",
//       this.sellerProfile?.projectMinimum
//         ? this.sellerProfile.projectMinimum
//         : ""
//     );
//     data.append(
//       "bonded",
//       this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
//     );
//     data.append(
//       "writtenContract",
//       this.sellerProfile?.writtenContract
//         ? this.sellerProfile.writtenContract
//         : ""
//     );
//     data.append(
//       "address",
//       this.sellerProfile?.address ? this.sellerProfile.address : ""
//     );
//     data.append(
//       "postalCode",
//       this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
//     );
//     data.append(
//       "paymentMethod",
//       this.sellerProfile?.paymentMethod ? this.sellerProfile.paymentMethod : ""
//     );
//     data.append(
//       "warrantyTerms",
//       this.sellerProfile?.warrantyTerms ? this.sellerProfile.warrantyTerms : ""
//     );
//     data.append(
//       "country",
//       this.sellerProfile?.country ? this.sellerProfile.country : ""
//     );
//     data.append(
//       "state",
//       this.sellerProfile?.state ? this.sellerProfile.state : ""
//     );
//     data.append(
//       "city",
//       this.sellerProfile?.city ? this.sellerProfile.city : ""
//     );
//     data.append(
//       "twitterURL",
//       this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
//     );
//     data.append(
//       "instagramURL",
//       this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
//     );
//     data.append(
//       "facebookURL",
//       this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
//     );

//     data.append("libilityInsurance", file);
//     data.append("id", this.userId);
//     this.userService.updateSellerLibilityInsurance(data).subscribe({
//       next: (res) => {
//         this.IdentityCardfileUpload(this.IdentityCardfile);
//       },
//       error: (err) => {
//         this.getUserProfile();
//       },
//     });
//     return;
//   }

//   IdentityCardfileUpload(file) {
//     let data: FormData = new FormData();

//     data.append(
//       "companyName",
//       this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
//     );
//     data.append(
//       "description",
//       this.sellerProfile?.description ? this.sellerProfile.description : ""
//     );
//     data.append(
//       "termsConditions",
//       this.sellerProfile?.termsConditions
//         ? this.sellerProfile.termsConditions
//         : ""
//     );
//     data.append(
//       "companyType",
//       this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
//     );
//     data.append(
//       "noOfEmployee",
//       this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
//     );
//     data.append(
//       "returnPolicy",
//       this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
//     );
//     data.append(
//       "liabilityInsurance",
//       this.sellerProfile?.liabilityInsurance
//         ? this.sellerProfile.liabilityInsurance
//         : ""
//     );
//     data.append(
//       "workerCompensation",
//       this.sellerProfile?.workerCompensation
//         ? this.sellerProfile.workerCompensation
//         : ""
//     );
//     data.append(
//       "projectMinimum",
//       this.sellerProfile?.projectMinimum
//         ? this.sellerProfile.projectMinimum
//         : ""
//     );
//     data.append(
//       "bonded",
//       this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
//     );
//     data.append(
//       "writtenContract",
//       this.sellerProfile?.writtenContract
//         ? this.sellerProfile.writtenContract
//         : ""
//     );
//     data.append(
//       "address",
//       this.sellerProfile?.address ? this.sellerProfile.address : ""
//     );
//     data.append(
//       "postalCode",
//       this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
//     );
//     data.append(
//       "paymentMethod",
//       this.sellerProfile?.paymentMethod ? this.sellerProfile.paymentMethod : ""
//     );
//     data.append(
//       "warrantyTerms",
//       this.sellerProfile?.warrantyTerms ? this.sellerProfile.warrantyTerms : ""
//     );
//     data.append(
//       "country",
//       this.sellerProfile?.country ? this.sellerProfile.country : ""
//     );
//     data.append(
//       "state",
//       this.sellerProfile?.state ? this.sellerProfile.state : ""
//     );
//     data.append(
//       "city",
//       this.sellerProfile?.city ? this.sellerProfile.city : ""
//     );
//     data.append(
//       "twitterURL",
//       this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
//     );
//     data.append(
//       "instagramURL",
//       this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
//     );
//     data.append(
//       "facebookURL",
//       this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
//     );

//     data.append("IdentityCard", file);
//     data.append("id", this.userId);
//     this.userService.updateSellerIdentityCard(data).subscribe({
//       next: (res) => {
//         this.toastrService.success("Files has been updated!");
//         this.getUserProfile();
//       },
//       error: (err) => {
//         this.getUserProfile();
//       },
//     });
//     return;
//   }

//   filesUpload(): void {
//     this.licensefileUpload(this.licensefileSelected);
//   }

//   openLicense() {
//     if (this.LisenceURL == undefined || this.LisenceURL == "") {
//       return;
//     }
//     window.open(this.baseURL + this.LisenceURL, "_blank");
//   }
//   openLibilityInsurance() {
//     if (
//       this.LibilityInsuranceURL == undefined ||
//       this.LibilityInsuranceURL == ""
//     ) {
//       return;
//     }
//     window.open(this.baseURL + this.LibilityInsuranceURL, "_blank");
//   }
//   openIdentityCard() {
//     if (this.IdentityCardURL == undefined || this.IdentityCardURL == "") {
//       return;
//     }
//     window.open(this.baseURL + this.IdentityCardURL, "_blank");
//   }
// }

import { Component, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { UserService } from "@core/services/services/user.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-verifications",
  templateUrl: "./verifications.component.html",
  styleUrls: ["./verifications.component.scss"],
})
export class VerificationsComponent implements OnInit {
  public baseURL: any = environment.serverURL;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ) {
    this.userId = JSON.parse(window.localStorage.getItem("currentUser"))._id;
  }

  public userId = "";
  public sellerProfile: any;

  public LisenceExtension: "";
  public LisenceURL: "";

  public LibilityInsuranceExtension: "";
  public LibilityInsuranceURL: "";

  public IdentityCardExtension: "";
  public IdentityCardURL: "";

  licensePhotoChangedEvent: any = "";
  licensePhotoChangedEventTYPE: any = "";
  libilityInsurancePhotoChangedEvent: any = "";
  libilityInsurancePhotoChangedEventTYPE: any = "";
  IdentityCardPhotoChangedEvent: any = "";
  IdentityCardPhotoChangedEventTYPE: any = "";

  get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {
        this.sellerProfile = res;

        this.LisenceURL = res.license;
        this.LibilityInsuranceURL = res.libilityInsurance;
        this.IdentityCardURL = res.IdentityCard;
      },
    });
  }

  licensefileChangeEvent(event: any): void {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      if (file.size > maxSize) {
        this.toastrService.error("Please upload a file under 5 MB");
        return;
      }

      let data: FormData = new FormData();

      data.append(
        "companyName",
        this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
      );
      data.append(
        "description",
        this.sellerProfile?.description ? this.sellerProfile.description : ""
      );
      data.append(
        "termsConditions",
        this.sellerProfile?.termsConditions
          ? this.sellerProfile.termsConditions
          : ""
      );
      data.append(
        "companyType",
        this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
      );
      data.append(
        "noOfEmployee",
        this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
      );
      data.append(
        "returnPolicy",
        this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
      );
      data.append(
        "liabilityInsurance",
        this.sellerProfile?.liabilityInsurance
          ? this.sellerProfile.liabilityInsurance
          : ""
      );
      data.append(
        "workerCompensation",
        this.sellerProfile?.workerCompensation
          ? this.sellerProfile.workerCompensation
          : ""
      );
      data.append(
        "projectMinimum",
        this.sellerProfile?.projectMinimum
          ? this.sellerProfile.projectMinimum
          : ""
      );
      data.append(
        "bonded",
        this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
      );
      data.append(
        "writtenContract",
        this.sellerProfile?.writtenContract
          ? this.sellerProfile.writtenContract
          : ""
      );
      data.append(
        "address",
        this.sellerProfile?.address ? this.sellerProfile.address : ""
      );
      data.append(
        "postalCode",
        this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
      );
      data.append(
        "paymentMethod",
        this.sellerProfile?.paymentMethod
          ? this.sellerProfile.paymentMethod
          : ""
      );
      data.append(
        "warrantyTerms",
        this.sellerProfile?.warrantyTerms
          ? this.sellerProfile.warrantyTerms
          : ""
      );
      data.append(
        "country",
        this.sellerProfile?.country ? this.sellerProfile.country : ""
      );
      data.append(
        "state",
        this.sellerProfile?.state ? this.sellerProfile.state : ""
      );
      data.append(
        "city",
        this.sellerProfile?.city ? this.sellerProfile.city : ""
      );
      data.append(
        "twitterURL",
        this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
      );
      data.append(
        "instagramURL",
        this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
      );
      data.append(
        "facebookURL",
        this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
      );

      data.append("license", event.target.files[0]);
      data.append("id", this.userId);
      this.userService.updateSellerLicense(data).subscribe({
        next: (res) => {
          this.toastrService.success("File has been updated!");
          this.getUserProfile();
        },
        error: (err) => {
          this.getUserProfile();
        },
      });
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  libilityInsurancefileChangeEvent(event: any): void {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      if (file.size > maxSize) {
        this.toastrService.error("Please upload a file under 5 MB");
        return;
      }
      let data: FormData = new FormData();
      data.append(
        "companyName",
        this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
      );
      data.append(
        "description",
        this.sellerProfile?.description ? this.sellerProfile.description : ""
      );
      data.append(
        "termsConditions",
        this.sellerProfile?.termsConditions
          ? this.sellerProfile.termsConditions
          : ""
      );
      data.append(
        "companyType",
        this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
      );
      data.append(
        "noOfEmployee",
        this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
      );
      data.append(
        "returnPolicy",
        this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
      );
      data.append(
        "liabilityInsurance",
        this.sellerProfile?.liabilityInsurance
          ? this.sellerProfile.liabilityInsurance
          : ""
      );
      data.append(
        "workerCompensation",
        this.sellerProfile?.workerCompensation
          ? this.sellerProfile.workerCompensation
          : ""
      );
      data.append(
        "projectMinimum",
        this.sellerProfile?.projectMinimum
          ? this.sellerProfile.projectMinimum
          : ""
      );
      data.append(
        "bonded",
        this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
      );
      data.append(
        "writtenContract",
        this.sellerProfile?.writtenContract
          ? this.sellerProfile.writtenContract
          : ""
      );
      data.append(
        "address",
        this.sellerProfile?.address ? this.sellerProfile.address : ""
      );
      data.append(
        "postalCode",
        this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
      );
      data.append(
        "paymentMethod",
        this.sellerProfile?.paymentMethod
          ? this.sellerProfile.paymentMethod
          : ""
      );
      data.append(
        "warrantyTerms",
        this.sellerProfile?.warrantyTerms
          ? this.sellerProfile.warrantyTerms
          : ""
      );
      data.append(
        "country",
        this.sellerProfile?.country ? this.sellerProfile.country : ""
      );
      data.append(
        "state",
        this.sellerProfile?.state ? this.sellerProfile.state : ""
      );
      data.append(
        "city",
        this.sellerProfile?.city ? this.sellerProfile.city : ""
      );
      data.append(
        "twitterURL",
        this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
      );
      data.append(
        "instagramURL",
        this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
      );
      data.append(
        "facebookURL",
        this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
      );

      data.append("libilityInsurance", event.target.files[0]);
      data.append("id", this.userId);
      this.userService.updateSellerLibilityInsurance(data).subscribe({
        next: (res) => {
          this.toastrService.success("File has been updated!");
          this.getUserProfile();
        },
        error: (err) => {
          this.getUserProfile();
        },
      });
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  IdentityCardfileChangeEvent(event: any): void {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      if (file.size > maxSize) {
        this.toastrService.error("Please upload a file under 5 MB");
        return;
      }
      let data: FormData = new FormData();

      data.append(
        "companyName",
        this.sellerProfile?.companyName ? this.sellerProfile.companyName : ""
      );
      data.append(
        "description",
        this.sellerProfile?.description ? this.sellerProfile.description : ""
      );
      data.append(
        "termsConditions",
        this.sellerProfile?.termsConditions
          ? this.sellerProfile.termsConditions
          : ""
      );
      data.append(
        "companyType",
        this.sellerProfile?.companyType ? this.sellerProfile.companyType : ""
      );
      data.append(
        "noOfEmployee",
        this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : ""
      );
      data.append(
        "returnPolicy",
        this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : ""
      );
      data.append(
        "liabilityInsurance",
        this.sellerProfile?.liabilityInsurance
          ? this.sellerProfile.liabilityInsurance
          : ""
      );
      data.append(
        "workerCompensation",
        this.sellerProfile?.workerCompensation
          ? this.sellerProfile.workerCompensation
          : ""
      );
      data.append(
        "projectMinimum",
        this.sellerProfile?.projectMinimum
          ? this.sellerProfile.projectMinimum
          : ""
      );
      data.append(
        "bonded",
        this.sellerProfile?.bonded ? this.sellerProfile.bonded : ""
      );
      data.append(
        "writtenContract",
        this.sellerProfile?.writtenContract
          ? this.sellerProfile.writtenContract
          : ""
      );
      data.append(
        "address",
        this.sellerProfile?.address ? this.sellerProfile.address : ""
      );
      data.append(
        "postalCode",
        this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : ""
      );
      data.append(
        "paymentMethod",
        this.sellerProfile?.paymentMethod
          ? this.sellerProfile.paymentMethod
          : ""
      );
      data.append(
        "warrantyTerms",
        this.sellerProfile?.warrantyTerms
          ? this.sellerProfile.warrantyTerms
          : ""
      );
      data.append(
        "country",
        this.sellerProfile?.country ? this.sellerProfile.country : ""
      );
      data.append(
        "state",
        this.sellerProfile?.state ? this.sellerProfile.state : ""
      );
      data.append(
        "city",
        this.sellerProfile?.city ? this.sellerProfile.city : ""
      );
      data.append(
        "twitterURL",
        this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ""
      );
      data.append(
        "instagramURL",
        this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ""
      );
      data.append(
        "facebookURL",
        this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ""
      );

      data.append("IdentityCard", event.target.files[0]);
      data.append("id", this.userId);
      this.userService.updateSellerIdentityCard(data).subscribe({
        next: (res) => {
          this.toastrService.success("File has been updated!");
          this.getUserProfile();
        },
        error: (err) => {
          this.getUserProfile();
        },
      });
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  openLicense() {
    if (this.LisenceURL == undefined || this.LisenceURL == "") {
      return;
    }
    window.open(this.baseURL + this.LisenceURL, "_blank");
  }
  openLibilityInsurance() {
    if (
      this.LibilityInsuranceURL == undefined ||
      this.LibilityInsuranceURL == ""
    ) {
      return;
    }
    window.open(this.baseURL + this.LibilityInsuranceURL, "_blank");
  }
  openIdentityCard() {
    if (this.IdentityCardURL == undefined || this.IdentityCardURL == "") {
      return;
    }
    window.open(this.baseURL + this.IdentityCardURL, "_blank");
  }
}
