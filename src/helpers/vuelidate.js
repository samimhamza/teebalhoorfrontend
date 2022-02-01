export default {
  validate(validationObjectProperty, context, name) {
    const errors = []
    if (!validationObjectProperty.$dirty) return errors
    if (validationObjectProperty.required !== undefined) !validationObjectProperty.required && errors.push(context.$tr("item_is_required", context.$tr(name)))
    if (validationObjectProperty.numeric !== undefined) !validationObjectProperty.numeric && errors.push(context.$tr("item_must_be_numeric", context.$tr(name)))
    if (validationObjectProperty.email !== undefined) !validationObjectProperty.email && errors.push(context.$tr("item_is_invalid", context.$tr(name)))
    if (validationObjectProperty.minLength !== undefined) !validationObjectProperty.minLength && errors.push(context.$tr("min_length", context.$tr(name), validationObjectProperty.$params.minLength.min))
    if (validationObjectProperty.minValue !== undefined) !validationObjectProperty.minValue && errors.push(context.$tr("min_value", context.$tr(name), validationObjectProperty.$params.minValue.min))
    if (validationObjectProperty.maxLength !== undefined) !validationObjectProperty.maxLength && errors.push(context.$tr("max_length", context.$tr(name), validationObjectProperty.$params.maxLength.max))
    if (validationObjectProperty.maxValue !== undefined) !validationObjectProperty.maxValue && errors.push(context.$tr("max_value", context.$tr(name), validationObjectProperty.$params.maxValue.max))
    if (validationObjectProperty.url !== undefined) !validationObjectProperty.url && errors.push(context.$tr("invalid_link"))
    if (validationObjectProperty.validFile !== undefined) !validationObjectProperty.validFile && errors.push(context.$tr("item_is_invalid", context.$tr(name)))
    if (validationObjectProperty.phoneNumber !== undefined) !validationObjectProperty.phoneNumber &&
      errors.push(context.$tr('item_is_invalid', context.$tr(name)));
    if (validationObjectProperty.alpha !== undefined) !validationObjectProperty.alpha &&
      errors.push(context.$tr('item_is_invalid', context.$tr(name)));

    return errors
  },

  isDataValid(validationObject, fields){
    return !fields.some(row => {
      return validationObject[row].$invalid;
    })
  },
}
