'use client';
import React from 'react';
import ComponentCard from '../common/ComponentCard';
import Label from '../form/Label';
import Select from '../form/Select';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import { FaMinus, FaPlus } from 'react-icons/fa6';

// Reusable, strict type
export interface PlanData {
  id?: string | number;
  planDay: number | string;
  planPrice: string;
  planType: string;
  planSubtitles: string[];
  isPopular: boolean;
  planPriceUSD: number,
  planPriceINR: number,
}

//  Props with proper types (no `any`)
export interface PlanSectionProps {
  data: PlanData;
  onChange: (updatedData: PlanData) => void;
  onPopularChange: () => void;
  errors?: Record<string, string>;
}

const PlanSection: React.FC<PlanSectionProps> = ({
  data,
  onChange,
  onPopularChange,
  errors,
}) => {
  //  Update single field with generic safety
  const handleChange = <K extends keyof PlanData>(
    field: K,
    value: PlanData[K]
  ) => {
    onChange({ ...data, [field]: value });
    if (errors && errors[field]) {
      errors[field] = "";
    }
  };

  //  Add subtitle
  const addSubtitle = () => {
    onChange({ ...data, planSubtitles: [...data.planSubtitles, ''] });
  };

  // Remove subtitle
  const removeSubtitle = (index: number) => {
    const updated = data.planSubtitles.filter((_, i) => i !== index);
    onChange({ ...data, planSubtitles: updated });
  };

  // Update subtitle text
  const handleSubtitleChange = (index: number, value: string) => {
    const updated = [...data.planSubtitles];
    updated[index] = value;
    onChange({ ...data, planSubtitles: updated });
  };

  return (
    <ComponentCard title="Add Plan" name="">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Plan Day</Label>
          <Select
            options={[
              { value: '3', label: '3 Month' },
              { value: '6', label: '6 Month' },
              { value: '12', label: '12 Month' },
              { value: 'Custom', label: 'Custom' },
            ]}
            value={String(data.planDay)}
            onChange={(val: string) => handleChange('planDay', val)}
            placeholder="Select plan duration"
            error={!!errors?.planDay}
          // hint={errors?.planDay}
          />
          {errors?.planDay && (
            <p className="text-sm text-error-500 mt-1">{errors.planDay}</p>
          )}

        </div>
        {data.planDay !== "Custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* USD PRICE */}
            <div>
              <Label>Plan Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>

                <Input
                  type="number"
                  placeholder="Enter USD"
                  className="pl-8"
                  value={String(data.planPriceUSD)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("planPriceUSD", Number(e.target.value))
                  }

                  error={!!errors?.planPriceUSD}
                />
              </div>

              {data.planDay !== "Custom" && errors?.planPriceUSD && (
                <p className="text-sm text-error-500 mt-1">{errors.planPriceUSD}</p>
              )}
            </div>

            {/* INR PRICE */}
            <div>
              <Label>Plan Price (INR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  ₹
                </span>

                <Input
                  type="number"
                  placeholder="Enter INR"
                  className="pl-8"
                  value={String(data.planPriceINR)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("planPriceINR", Number(e.target.value))
                  }
                  error={!!errors?.planPriceINR}
                />
              </div>
              {data.planDay !== "Custom" && errors?.planPriceINR && (
                <p className="text-sm text-error-500 mt-1">{errors.planPriceINR}</p>
              )}
            </div>

          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-4">
        <div>
          <Label>Plan Type</Label>
          <Select
            options={[
              { value: 'Starter', label: 'Starter' },
              { value: 'Pro', label: 'Pro' },
              { value: 'Premium', label: 'Premium' },
              { value: 'Flexible', label: 'Flexible' },
            ]}
            value={data.planType}
            onChange={(val: string) => handleChange('planType', val)}
            placeholder="Select category"
            error={!!errors?.planType}
          // hint={errors?.planType}
          />
          {errors?.planType && (
            <p className="text-sm text-error-500 mt-1">{errors.planType}</p>
          )}

        </div>
        <div>
          <Label>Plan Popular</Label>
          <Checkbox
            checked={data.isPopular}
            onChange={onPopularChange}
            label="Popular"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Plan Sub Title</Label>
            <button
              type="button"
              className="bg-[#ffcb07] w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#e6b800] transition-colors duration-200"
              onClick={addSubtitle}
            >
              <FaPlus className="w-4 h-4" />
            </button>
          </div>

          {data.planSubtitles.map((subtitle, index) => (
            <div key={index} className="relative mb-2">
              <Input
                type="text"
                placeholder={`Enter sub title ${index + 1}`}
                value={subtitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSubtitleChange(index, e.target.value)
                }
                error={!!errors?.[`planSubtitles[${index}]`]}
              // hint={errors?.[`planSubtitles[${index}]`]}
              />
              {errors?.[`planSubtitles[${index}]`] && (
                <p className="text-sm text-error-500 mt-1">
                  {errors[`planSubtitles[${index}]`]}
                </p>
              )}
              {data.planSubtitles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubtitle(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#ffcb07] text-[#ffcb07] w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#ffcb07] hover:text-black transition-colors duration-200"
                >
                  <FaMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </ComponentCard>
  );
};

export default PlanSection;
