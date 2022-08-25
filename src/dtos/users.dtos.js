import _ from "lodash";
import validator from "validator";

export const userRequestDTO = (body) => {
  const errors = [];

  if(_.isNil(body.name)){
    errors.push("Name is required")
  }
  if(_.isNil(body.lastname)){
    errors.push("Lastname is required")
  }
  if (_.isNil(body.email)) {
    errors.push("Email is required");
  }
  if (!_.isNil(body.email) && !validator.isEmail(body.email)) {
    errors.push("Invalid email address");
  }
  if(_.isNil(body.password)){
    errors.push("Password is required")
  }
  if(_.isNil(body.nationality)){
    errors.push("Nationality is required")
  }
  if(errors.length !== 0){
    console.log(errors)
    throw new Error(errors)
  } else {
    return body
  }
}

export const changePasswordRequestDTO = (data) => {
  const errors = [];
  if (_.isNil(data.email)) {
    errors.push("Email is required");
  }
  if (!_.isNil(data.email) && !validator.isEmail(data.email)) {
    errors.push("Invalid email");
  }
  if (_.isNil(data.currentPassword)) {
    errors.push("Current password is required");
  }

  if (_.isNil(data.newPassword)) {
    errors.push("New password is required");
  }
  if (errors.length !== 0) {
    throw new Error(errors);
  } else {
    return data;
  }
};

export const loginRequestDTO = (data) => {
  const errors = [];

  if (_.isNil(data.email)) {
    errors.push("Email is required");
  }

  if (_.isNil(data.password)) {
    errors.push("Password is required");
  }

  if (!_.isNil(data.email) && !validator.isEmail(data.email)) {
    errors.push("Invalid email");
  }
  if (errors.length !== 0) {
    throw new Error(errors);
  } else {
    return data;
  }
};
