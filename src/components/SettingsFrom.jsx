
import React,
{
  Fragment,
  useEffect,
  useState
} from 'react'
import useStore from '../store/index.js'
import { useForm } from 'react-hook-form'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition
} from '@headlessui/react'
import {
  BsChevronExpand,
  BsUiChecks
} from 'react-icons/bs'
import { fetchCountries } from '../libs/index.js'
import Input from '../components/ui/input.jsx'
import Button from '../components/ui/button.jsx'
import { toast } from 'sonner'
import api from '../libs/apiCall.js'
import { BiLoader } from 'react-icons/bi'

const SettingsFrom = () => {

  const {
    user,
    theme,
    setTheme
  } = useStore((state) => state)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...user },
  })

  const [selectedCountry, setSelectedCountry] = useState({
    country: user?.country, currency: user?.currency
  } );

  const [query, setQuery] = useState("");

  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => { 
    try {
      setLoading(true);
      const newData = {
        ...values,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      }

      const { values: res } = await api.put(`users/update-user/${user?.id}`, newData)

      if (res?.user) {
        const newUser = { ...res.user, token: user.token }
        localStorage.setItem("user", JSON.stringify(newUser));

        toast.success(res?.message)
      }
    }
    catch (err) {
      console.error("Something went wrong:", err);
      toast.error(err?.response?.data?.message || err.message);
    }
    finally {
      setLoading(false);
    }


  }
  
  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  }

  const filteredCountries = query === ""
    ? countriesData
    : countriesData.filter((country) =>
      country.country
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(
          query.toLowerCase().replace(/\s+/g, '')
        )
    );
  
  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  }

  useEffect(() => {
    getCountriesList();
  }, []);


  const Countries = () => {
    return (
      <div
        className='w-full relative'>
        <Combobox
          value={selectedCountry}
          onChange={setSelectedCountry}
        >

          <div
            className="relative mt-1">
            <div>
              <ComboboxInput
                className="inputStyle"
                displayValue={(country) => country?.country }
                onChange={(e) => setQuery(e.target.value)}
              />

              <ComboboxButton
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <BsChevronExpand
                  className="text-gray-400"
                />
              </ComboboxButton>
            </div>

          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">

              {
                filteredCountries.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-200 dark:text-gray-500">

                    Nothing found.

                  </div>
                ) : (
                    filteredCountries.map((country) => (
                      <ComboboxOption
                        key={country.country}
                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                          ? 'bg-violet-600/20 text-white'
                          : 'text-gray-900 dark:text-gray-200'
                        }`
                        }
                        value={country}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center gap-2">
                              <img
                                src={country.flag}
                                alt={country.country}
                                className="w-8 h-5 rounded-sm object-cover"
                              />
                              <span
                                className={`block truncate text-gray-700 dark:text-gray-500 ${
                                  selected ? "font-medium" : "font-normal"
                                  }`
                                }
                              >
                                {country.country}
                              </span>
                            </div>
                            {
                              selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ?
                                      'text-white'
                                      : 'text-teal-600'
                                    }`
                                  }
                                >
                                  <BsUiChecks className="h-5 w-5 aria-hidden='true'"/>

                                </span>
                              ): (
                                  null
                              )
                            }
                          </>
                          )
                        }
                      </ComboboxOption>
                    ))
                )
            
              }

            </ComboboxOptions>

          </Transition>

        </Combobox>

      </div>
    )
  }


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div
            className="w-full">
            <Input
              disabled={loading}
              id="firstname"
              type="text"
              label="First Name"
              placeholder="Jon"
              {...register("firstname", {
                  required: "First name is required",
                })
              }
              error={errors.firstname?.message}
              className="inputStyle"
            />
          </div>

          <div
            className="w-full">
            <Input
              disabled={loading}
              id="lastname"
              type="text"
              label="Last Name"
              placeholder="Snow"
              {...register("lastname") }
              error={errors.lastname?.message}
              className="inputStyle"
            />
          </div>

        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div
            className="w-full">
            <Input
              disabled={loading}
              id="email"
              type="email"
              label="Email"
              placeholder="Jonsnow@gmail.com"
              {...register("email", {
                required: "Email is required",
              })}
              error={errors.email?.message}
              className="inputStyle"
            />
          </div>

          <div
            className="w-full">
            <Input
              disabled={loading}
              id="contact"
              type="phone"
              label="Phone Number"
              placeholder="+91 1234567890"
              {...register("contact", {
                required: "Contact number is required",
                minLength: {
                  value: 10,                  
                },
              })}
              error={errors.contact?.message}
              className="inputStyle"
            />
          </div>

        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div
            className="w-full">
            <span
              className='labelStyles'
            >
              Country
            </span>
            <Countries />
          </div>

          <div
            className="w-full">
            <span
              className='labelStyles'>
              Currency
            </span>
            <select>
              <option
                className="inputStyle">
                {selectedCountry?.currency || user?.country}
              </option>
            </select>
          </div>

        </div>


        <div
          className="w-full flex items-center justify-between pt-10">
          <div
            className="">
            <p
              className="text-lg text-black dark:text-gray-400 font-semibold">
        
              Appearance
            </p>
            <span
              className="lableStyles">
              Customize how your theme looks on your device.

            </span>

          </div>

          <div
            className="w-28 md:w-40">
            <select
              className="inputStyles"
              defaultValue={theme}
              onChange={(e) => toggleTheme(e.target.value)}
            >
              <option values="light" >Light</option>
              <option values="dark" >Dark</option>
            </select>

          </div>


        </div>

        <div
          className="w-full flex items-center justify-between pt-10">
          <div>
            <p
              className="text-lg text-black dark:text-gray-400 font-semibold">
              Language

            </p>
            <span
              className='lableStyles'>
              Customize what language you want ot use
            </span>
          </div>

          <div
            className="w-28 md:w-40">
            <select
              className="inputStyles">
              <option value="en">
                English
              </option>
            </select>
          </div>

        </div>

        <div
          className="w-full flex items-center justify-end gap-5 pt-10">
          <Button
            variant="outline"
            loading={loading}
            type="reset"
            className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Reset
          </Button>
          <Button
            variant="default"
            loading={loading}
            type="submit"
            className="px-6 bg-violet-800 text-white hover:bg-violet-700"
          >
            {loading ? <BiLoader className='animate-spin text-white'/> : "Save"}
          </Button>
        </div>




        <div
          className="border-b mt-8 border-gray-900 dark:border-gray-700"></div>
      </form>
    </>
  )
}

export default SettingsFrom
