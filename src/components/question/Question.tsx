"use client"
import React, { useEffect, useState } from 'react'
import ComponentCard from '../common/ComponentCard';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import DatePicker from '../form/date-picker';
import Radio from '../form/input/Radio';
import TextArea from '../form/input/TextArea';
import axios from 'axios';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

const Question = () => {
  const [selectedValue, setSelectedValue] = useState<string>("option2");
  const [messageTwo, setMessageTwo] = useState("");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };
    const baseURL = process.env.NEXT_PUBLIC_APP_URL;

 const getBlogData = () => {
    // Fetch theme data logic here
    api.get(`${endPointApi.getAllBlogs}`)
      .then(response => {
        console.log("ressss",response);
        
      })
      .catch(error => {
        console.error('Error fetching theme data:', error)
      })
  }

  useEffect(() => { 
    getBlogData()
  }, [])
  return (
    <>
      <div className="space-y-6">
        <ComponentCard title='' name=''>
          <div className="space-y-6">
            <div>
              <Label>Exam Name</Label>
              <Input type="text" placeholder="exam name" />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                placeholder="title"
                type="text"
              />
            </div>
            <div>
              <DatePicker
                id="date-picker"
                label="Date Picker Input"
                placeholder="Select a date"
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  console.log({ dates, currentDateString });
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <Radio
                id="radio1"
                name="group1"
                value="option1"
                checked={selectedValue === "option1"}
                onChange={handleRadioChange}
                label="Active"
              />
              <Radio
                id="radio2"
                name="group1"
                value="option2"
                checked={selectedValue === "option2"}
                onChange={handleRadioChange}
                label="Inactive"
              />

            </div>
            <div>
              <Label>Sort Description</Label>
              <Input type="text" placeholder="sort description" />
            </div>
            <div className="space-y-6">
              <div>
                <Label>Description</Label>
                <TextArea
                  rows={6}
                  value={messageTwo}
                  error
                  onChange={(value) => setMessageTwo(value)}
                  hint="Please enter a valid message."
                />
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>

  )
}

export default Question