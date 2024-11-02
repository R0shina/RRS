<div>
    <div x-show="!showGuarantor" class="add-guarantor-btn">
        <a href="#" @click.prevent="toggleGuarantor" class="add-guarantor">Add Second Guarantor +</a>
    </div>

    <div x-show="showGuarantor" class="remove-guarantor-btn">
        <a href="#" @click.prevent="toggleGuarantor" class="remove-guarantor">Remove Second Guarantor —</a>
    </div>


    <div > 
        <div class="guarantor-section">
            <div id="company_guarantor2_section" class="row-form-section2"  x-show="showGuarantor">
                <div class="step_cont">
                   

                    <div x-data="CompGuarantorEmployerDetails({type: 'guarantor_2'})"
                        @validate-guarantor-employer.window="validateEmployerDetails('test-employee-two')"
                        id="test-employee-two">
                        <div class="steps"
                            @open-guarantor-employee-detail-accordion.window="console.log('this is from dispatcher Acoordion');openEmployeementAccordion()">
                            <h2 class="body-sub-head-form">Employer details</h2>
                        </div>
                        <div class="row-form-section2">
                            <div class="contact_details">
                                <template x-for="subStep in guarantorSteps" :key="subStep.id">
                                    <!-- <div :id="subStep.id + 'guarantor_2'"> -->
                                    <div :id="subStep.id + '-2'">
                                        <h4 class="body-sub-form-head" :aria-controls="subStep.id"
                                            :aria-disabled="!subStep.isShown"
                                            x-bind:aria-expanded="currentSubStep === subStep.step"
                                            @click="if(subStep.visitable) { gotoGuarantorStep(subStep.id) }">
                                            <span :id="subStep.id" x-transition x-cloak>
                                                <span class="error-container-icon" x-show="!subStep.isValid">
                                                    <i class="error-icon fas fa-exclamation-circle"
                                                        aria-hidden="true"></i>
                                                </span>
                                            </span>
                                            <span x-text="subStep.name"></span>
                                        </h4>
                                        <div class="col-form-field-flex-personal" :id="subStep.id"
                                            x-show="subStep.isShown" x-transition x-cloak>
                                            <div x-show="!subStep.isValid" class="error-container">
                                                <div class="error-message">
                                                    <span class="errors">
                                                        Error
                                                    </span>
                                                    <p>
                                                        Missing information for this section
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="accordion-content">
                                              

                                                <template x-if="subStep.id === 'guarantor-employement-contact-detail'">
                                                    <div>
                                                        <div class="col-form-field-personal">
                                                            <div class="form-module-field  input-validators"
                                                                :class="{ 'input-error': errors?.guarantor_2_employment_detail_name != null }"
                                                                data-validate='[{"type": "required","field": "guarantor_2_employment_detail_name", "message": "Name is required."}]'>
                                                                <label for="Name"> Name</label>
                                                                [text guarantor_2_employment_detail_name
                                                                class:auto-car-field placeholder
                                                                "Name"]
                                                            </div>

                                                            <div x-data="PhoneFormat()"
                                                                class="form-module-field  input-validators"
                                                                @input="handleInput"
                                                                :class="{ 'input-error': errors?.guarantor_2_employment_detail_phone != null }"
                                                                data-validate='[ {"type": "required", "field": "guarantor_2_employment_detail_phone", "message": "Phone number is required"},
                                                                {"type": "tel", "field": "guarantor_2_employment_detail_phone", "message": "Phone number must contain only digit"},
                                                        {"type": "length", "field": "guarantor_2_employment_detail_phone", "minlength": 7, "maxlength": 12, "message": "Phone number must be between 7 and 10 digits"}]'>
                                                                <label for="Phone Number">Phone Number:</label>
                                                                [tel guarantor_2_employment_detail_phone maxlength:12
                                                                class:auto-car-field placeholder "000 000 000"]
                                                                <div x-show="error" class="error-message"
                                                                    x-text="error"></div>

                                                            </div>
                                                        </div>


                                                        <div id="form-btn-main">
                                                            <button type="button" id="auto-car-field-button-11"
                                                                class="btn  button-next"
                                                                @click="validateGuarantorContactDetails()">Save &
                                                                Next</button>
                                                            <i class="icn-next-long"></i>
                                                        </div>
                                                    </div>
                                                </template>

                                                <template x-if="subStep.id === 'guarantor-employment-business-address'">
                                                    <div>

                                                        <div class="">
                                                            <!-- 
                                                            <div class="col-form-field-personal">
                                                                <div class="form-module-field input-validators"
                                                                    :class="{ 'input-error': errors?.guarantor_business_address_streetnumber != null }"
                                                                    data-validate='[{"type": "required","field": "business_street_number", "message": "Street Number is required."}]'>
                                                                    <label for="Street Number">Street Number</label>
                                                                    [text guarantor_business_address_streetnumber
                                                                    class:auto-car-field
                                                                    placeholder "Street No."]
                                                                </div>
                                                                <div class="form-module-field input-validators"
                                                                    :class="{ 'input-error': errors?.guarantor_business_address_streetname != null }"
                                                                    data-validate='[{"type": "required","field": "business_street_number", "message": "Street Number is required."}]'>
                                                                    <label for="Street Name">Street Name</label>
                                                                    [text guarantor_business_address_streetname
                                                                    class:auto-car-field
                                                                    placeholder "Street Name"]
                                                                </div>
                                                            </div> -->




                                                            <div class="col-form-field-personal">

                                                                <div class="form-module-field street companies input-validators"
                                                                    x-data="GComplete({addressId: 'guarantor2_business_address_streetnumber_'  , postalId: 'guarantor_2_business_address_postcode',stateId: 'guarantor_2_business_address_state',suburbId: 'guarantor_2_business_address_suburbtown'})"
                                                                    :class="{ 'input-error': errors?.guarantor2_business_address_streetnumber_ }"
                                                                    data-validate='[{"type": "required", "field": "guarantor2_business_address_streetnumber_", "message": "Street Address is required"}]'>
                                                                    <label for="Street Number">Street
                                                                        Number/Address</label>

                                                                    [text guarantor2_business_address_streetnumber_
                                                                    class:auto-car-field class:google-autoplaces
                                                                    class:contact_num placeholder "Street Address"]
                                                                    <!-- </span> -->
                                                                </div>

                                                                <div class="form-module-field input-validators"
                                                                    :class="{ 'input-error': errors?.guarantor_2_business_address_suburbtown != null }"
                                                                    data-validate='[{"type": "required","field": "business_street_number", "message": "Street Number is required."}]'>
                                                                    <label for="Suburb">Suburb</label>
                                                                    [text guarantor_2_business_address_suburbtown
                                                                    class:auto-car-field
                                                                    placeholder "Suburb"]
                                                                </div>

                                                            </div>

                                                            <div class="col-form-field-personal">

                                                                <div class="form-module-field input-validators select_fm"
                                                                    :class="{ 'input-error': errors?.guarantor_2_business_address_state != null }"
                                                                    data-validate='[{"type": "required","field": "business_street_number", "message": "Street Number is required."}]'>
                                                                    <label class="select_label"
                                                                        for="State">State</label>
                                                                    [select guarantor_2_business_address_state
                                                                    class:auto-car-field first_as_label
                                                                    "Select" "ACT" "NSW" "NT" "QLD" "SA" "TAS" "VIC"
                                                                    "WA"]
                                                                </div>

                                                                <div class="form-module-field input-validators"
                                                                    :class="{ 'input-error': errors?.guarantor_2_business_address_postcode != null }"
                                                                    data-validate='[{"type": "required","field": "business_street_number", "message": "Street Number is required."}]'>
                                                                    <label for="Postcode">Postcode</label>
                                                                    [number guarantor_2_business_address_postcode
                                                                    class:auto-car-field
                                                                    placeholder "Postcode"]
                                                                </div>
                                                            </div>

                                                            <div id="form-btn-main">
                                                                <button type="button" id="auto-car-field-button-12"
                                                                    class="btn  button-next"
                                                                    @click="validateGuarantorBusinessAddress()">Save
                                                                    & Next</button>
                                                                <i class="icn-next-long"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>

                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- </template> -->
        </div>
    </div>
</div>