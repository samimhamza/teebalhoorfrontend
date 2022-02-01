import {
  maxLength,
  minLength,
  required,
  email,
  requiredIf,
  sameAs,
  numeric,
  decimal,
  minValue,
  helpers,
  url,
} from 'vuelidate/lib/validators';

export const phoneNumber = helpers.regex('phoneNumber', /^[\d()+]{7,15}$/);

const validImage = (image) => {
  if (image) {
    if (image instanceof File) {
      const fileExtension = image.type;
      const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
      return allowedExtensions.includes(fileExtension);
    }
    return true;
  }
  return false;
};
const urlRegex = helpers.regex('urlRegex', /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm);


const urlRegexV = (link) => {
  if(link){
    const expression = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
    var regex = new RegExp(expression);
    if(link.match(regex)){
      return true;
    }else{
      return false;
    }
  }
}

//if an excel file is selected in bulk upload
const validFile = (file) => {
  if (file) {
    if (file instanceof File) {
      const fileExtension = file.type;
      const allowedExtensions =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      return allowedExtensions == fileExtension;
    }
    return true;
  }
  return false;
};

const MAX_LENGTH = 32;
const MIN_LENGTH = 2;

const Validations = {
  remarksValidation: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(500),
  },
  name100Validation: {
    required,
    minLength: minLength(2),
    maxLength: maxLength(100),
  },
  usernameValidation: {
    required,
    minLength: minLength(2),
    maxLength: maxLength(32),
  },
  nameValidation: {
    required,
    minLength: minLength(MIN_LENGTH),
    maxLength: maxLength(MAX_LENGTH),
  },
  requiredValidation: { required },
  emailValidation: { required, email },
  phoneValidation: { required, phoneNumber },
  passwordValidation: {
    required,
    minLength: minLength(6),
    sameAsConfirmPassword: sameAs('confirm_password'),
  },
  password2Validation: {
    required,
    sameAsPassword: sameAs('password'),
    minLength: minLength(6),
  },
  requiredIf: (value) => requiredIf(() => value),
  dayValidation: { required, numeric, minLength: minLength(1) },
  numberValidation: { required, numeric, minLength: minLength(1) },
  decimalValidation: { required, decimal, minValue: minValue(0) },
  onlyDecimalValidation: { decimal, minValue: minValue(0) },
  imageValidation: { required, validImage },
  fileValidation: { required, validFile },
  urlValidation: { url },
  urlValidationRequired: { required,url },
  urlRegexpValidationRequired: { required, urlRegex},
};

export default Validations;
