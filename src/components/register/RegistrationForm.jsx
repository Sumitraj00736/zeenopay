import { useState, useEffect } from "react";
import { Pencil} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import countryCodes from "../contestentDetails/countryCodes.jsx";
import PhoneInputWithCountrySelector from "../ReusableInputField/PhoneInputWithCountrySelector.jsx";
import CustomDropdown from "../ReusableInputField/CustomDropdown.jsx";

export default function EventRegistrationForm({ fields }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [inputFocused, setInputFocused] = useState({}); // Track focus state for each field

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    permanentAddress: "",
    temporaryAddress: "",
    guardianName: "",
    contactNumber: "",
    optionalNumber: "",
    email: "",
    reason: "",
    source: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFocus = (fieldName) => {
    setInputFocused((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setInputFocused((prev) => ({ ...prev, [fieldName]: false }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (fields.female_only) {
      if (!formData.age) errors.age = "This field is required";
      if (!formData.height) errors.height = "This field is required";
    }
    if (!formData.name.trim()) errors.name = "This field is required";

    if (!formData.gender && !fields.female_only)
      errors.gender = "This field is required";
    if (!formData.guardianName.trim())
      errors.guardianName = "This field is required";
    if (!formData.permanentAddress.trim())
      errors.permanentAddress = "This field is required";

    // Validate Contact Number
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "This field is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Invalid contact number";
    }

    // Validate Optional Number (Only if it's filled)
    if (
      formData.optionalNumber.trim() &&
      !/^\+?\d{10,15}$/.test(formData.optionalNumber)
    ) {
      errors.optionalNumber = "Invalid contact number";
    }

    // Validate Email
    if (!formData.email.trim()) {
      errors.email = "This field is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    setErrors(errors);

    // Return true if no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "prefer-not", label: "Prefer not to say" },
  ];

  const handleSave = () => {
    if (validateForm()) {
      navigate("/registration/confirmation", { state: formData });
    }
  };

  const handleDropdownChange = (value) => {
    setFormData((prev) => ({ ...prev, source: value }));
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
      {/* Image Skeleton */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
      </div>

      {/* Form Inputs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Textarea Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-24 bg-gray-700 rounded-md"></div>
      </div>

      {/* Select Dropdown Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-10 bg-gray-700 rounded-md"></div>
      </div>

      {/* Save Button Skeleton */}
      <div className="flex justify-center">
        <div className="h-10 bg-gray-700 rounded-2xl w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-customBlue text-center pb-20">
      <div className="pb-10 pt-20">
        <h1 className="font-semibold text-4xl text-white">Registration</h1>
      </div>
      <div className="flex bg-customBlue justify-center items-center p-4 md:min-h-screen">
        <div className="bg-customDarkBlue w-full max-w-6xl p-8 rounded-lg shadow-2xl">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="flex justify-center mb-16">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-white text-lg font-semibold">
                    Image
                  </span>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-none overflow-hidden flex items-center justify-center bg-gray-700">
                      {image ? (
                        <img
                          src={image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={
                            fields.female_only
                              ? "https://cdn-icons-png.flaticon.com/512/4140/4140036.png" // Female avatar 👩
                              : "https://cdn-icons-png.flaticon.com/512/4140/4140037.png" // Male avatar 👨
                          }
                          alt="User Icon"
                          className="w-16 h-16 object-contain"
                        />
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 bg-blue-900 p-2 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110">
                      <Pencil size={16} color="white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={() => handleBlur("name")}
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                    placeholder="Name"
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.name || inputFocused.name
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                  >
                    Name
                  </label>
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>

                {/* Gender Field (No Floating Label) */}
                {!fields.female_only && (
                  <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-row space-x-2 items-start md:items-center">
                      {genderOptions.map((option) => (
                        <motion.label
                          key={option.value}
                          className="flex items-center md:space-x-3 space-x-1 cursor-pointer p-2 rounded-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="w-4 h-4 md:w-5 md:h-5 border-2 border-white rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            {formData.gender === option.value && (
                              <motion.span
                                className="w-2.5 h-2.5 bg-white rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </motion.span>

                          <span className="text-sm md:text-base text-white">
                            {option.label}
                          </span>

                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </motion.label>
                      ))}
                    </div>

                    {errors.gender && (
                      <span className="text-red-500 text-sm">
                        {errors.gender}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* for female only Height */}
                {fields.female_only && (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("height")}
                        onBlur={() => handleBlur("height")}
                        className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                        placeholder="Height"
                      />
                      <label
                        htmlFor="height"
                        className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.height || inputFocused.height
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                      >
                        Height
                      </label>
                      {errors.height && (
                        <span className="text-red-500 text-sm">
                          {errors.height}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {/* Permanent Address Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("permanentAddress")}
                    onBlur={() => handleBlur("permanentAddress")}
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                    placeholder="Permanent Address"
                  />
                  <label
                    htmlFor="permanentAddress"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.permanentAddress ||
                        inputFocused.permanentAddress
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                  >
                    Permanent Address
                  </label>
                  {errors.permanentAddress && (
                    <span className="text-red-500 text-sm">
                      {errors.permanentAddress}
                    </span>
                  )}
                </div>

                {/* for female only */}
                {fields.female_only && (
                  <>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("age")}
                        onBlur={() => handleBlur("age")}
                        className=" [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                        placeholder="age"
                      />
                      <label
                        htmlFor="age"
                        className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.age || inputFocused.age
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                      >
                        Age
                      </label>
                      {errors.age && (
                        <span className="text-red-500 text-sm">
                          {errors.age}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {/* Temporary Address Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="temporaryAddress"
                    value={formData.temporaryAddress}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("temporaryAddress")}
                    onBlur={() => handleBlur("temporaryAddress")}
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                    placeholder="Temporary Address"
                  />
                  <label
                    htmlFor="temporaryAddress"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.temporaryAddress ||
                        inputFocused.temporaryAddress
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                  >
                    Temporary Address
                  </label>
                </div>

                {/* Guardian's Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("guardianName")}
                    onBlur={() => handleBlur("guardianName")}
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                    placeholder="Guardian's Name"
                  />
                  <label
                    htmlFor="guardianName"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.guardianName || inputFocused.guardianName
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                  >
                    Guardian's Name
                  </label>
                  {errors.guardianName && (
                    <span className="text-red-500 text-sm">
                      {errors.guardianName}
                    </span>
                  )}
                </div>

                {/* Contact Number Field */}
                <PhoneInputWithCountrySelector
                  countryCodes={countryCodes}
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  placeholder="Contact Number"
                  fieldName="contactNumber"
                />

                {/* Optional Contact Number Field */}
                <PhoneInputWithCountrySelector
                  countryCodes={countryCodes}
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  placeholder="Optional Contact Number"
                  fieldName="optionalNumber"
                />

                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.email || inputFocused.email
                          ? "top-0 -translate-y-1/2 text-blue-500 text-sm"
                          : "top-[26px] -translate-y-1/2"
                      }`}
                  >
                    Email
                  </label>
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                  )}
                </div>

                {/* Reason Field */}
                <div className="relative">
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("reason")}
                    onBlur={() => handleBlur("reason")}
                    className="mt-1 p-3 w-full bg-customDarkBlue border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 peer"
                    placeholder="Why do you want to participate in this Event?"
                    rows="4"
                  />
                  <label
                    htmlFor="reason"
                    className={`absolute left-3 bg-customDarkBlue px-2 text-gray-400 text-base transition-all
                      ${
                        formData.reason || inputFocused.reason
                          ? "top-0 -translate-y-1/2 text-blue-500 text-xs"
                          : "top-1/2 -translate-y-1/2 text-sm md:text-base"
                      }`}
                  >
                    Why do you want to participate in this Event?
                  </label>
                </div>

                {/* Source Field */}
                <CustomDropdown
                  options={[
                    {
                      value: "facebook/instagram",
                      label: "Facebook/Instagram",
                    },
                    { value: "linked/x/twitter", label: "LinkedIn/X/Twitter" },
                    { value: "tiktok/youtube", label: "TikTok/YouTube" },
                    {
                      value: "news/advertizement",
                      label: "News/Advertisement",
                    },
                    {
                      value: "family/friends/relative",
                      label: "Family/Friends/Relative",
                    },
                    { value: "others", label: "Others" },
                  ]}
                  formData={formData}
                  setFormData={setFormData}
                  placeholder="How did you know about this Event/Program?"
                  handleOnChangeDropDown={handleDropdownChange}
                  labelBgColor="bg-customDarkBlue"
                  optionBgColor="bg-customDarkBlue"
                  inputBgColor="bg-customDarkBlue"
                />
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSave}
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
