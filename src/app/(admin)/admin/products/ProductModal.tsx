'use client';

import api from '@/lib/api';
import { useEffect, useState } from 'react';

type Category = {
  id: string;
  name: string;
  subCategories?: SubCategory[];
};

type SubCategory = {
  id: string;
  name: string;
};

type Occasion = {
  id: string;
  name: string;
};

type ProductTag = {
  id: string;
  name: string;
};

type VariantValue = {
  id: string;
  name: string;
};

type VariantGroup = {
  id: string;
  name: string;
  icon?: string;
  values: VariantValue[];
};

type TabId =
  | 'basic'
  | 'pricing'
  | 'inventory'
  | 'variants'
  | 'media'
  | 'personalization'
  | 'seo'
  | 'shipping';

type Tab = {
  id: TabId;
  label: string;
};

const TABS: Tab[] = [
  { id: 'basic', label: '📄 BASIC INFO' },
  { id: 'pricing', label: '💰 PRICING' },
  { id: 'inventory', label: '📦 INVENTORY' },
  { id: 'variants', label: '🎨 VARIANTS' },
  { id: 'media', label: '🖼 MEDIA' },
  { id: 'personalization', label: '🎁 PERSONALIZATION' },
  { id: 'seo', label: '🔍 SEO' },
  { id: 'shipping', label: '🚚 SHIPPING' },
];

type ProductForm = {
  name: string;
  sku: string;
  slug: string;
  brand: string;
  description: string;

  categoryId: string;
  subCategoryId: string;

  tags: string;
  occasionIds: string[];
  productTagIds: string[];

  selectedVariantValueIds: string[];
  selectedVariants: Record<
  string,
  string[]
>;

  buyingPrice: number;
  price: number;
  discountPrice: number | null;
  tax: number;

  images: string[];
thumbnail: string;
videoUrl: string;

metaTitle: string;
metaDescription: string;

  stock: number;
reservedStock: number;
lowStockAlert: number;
trackInventory: boolean;
allowBackOrders: boolean;

weight: number | null;
length: number | null;
width: number | null;
height: number | null;

isPhysicalProduct: boolean;
freeShipping: boolean;
isFragile: boolean;
requiresColdStorage: boolean;

packagingType: string;
estimatedDelivery: string;

  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;

allowGiftMessage: boolean;
allowCustomText: boolean;
allowPhotoUpload: boolean;
maxMessageLength: number;
personalizationCharge: number;
};

const INITIAL_FORM: ProductForm = {
  name: '',
  sku: '',
  slug: '',
  brand: '',
  description: '',

  categoryId: '',
  subCategoryId: '',

  tags: '',
  occasionIds: [],
  productTagIds: [],
  selectedVariantValueIds: [],
  selectedVariants: {},

  buyingPrice: 0,
  price: 0,
  discountPrice: null,
  tax: 0,

images: [],
thumbnail: '',
videoUrl: '',

metaTitle: '',
metaDescription: '',

  stock: 0,
reservedStock: 0,
lowStockAlert: 5,

trackInventory: true,
allowBackOrders: false,

weight: null,
length: null,
width: null,
height: null,

isPhysicalProduct: true,

freeShipping: false,
isFragile: false,
requiresColdStorage: false,

packagingType: '',
estimatedDelivery: '',

  isActive: true,
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,


allowGiftMessage: false,
allowCustomText: false,
allowPhotoUpload: false,
maxMessageLength: 100,
personalizationCharge: 0,
};

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSave?: (formData: ProductForm) => Promise<void>; // Optional for now
};

const DEFAULT_VARIANTS: VariantGroup[] = [
  {
    id: 'colors',
    name: 'Colors',
    icon: '🎨',
    values: [
      { id: 'red', name: 'Red' },
      { id: 'black', name: 'Black' },
      { id: 'white', name: 'White' },
      { id: 'gold', name: 'Gold' },
      { id: 'pink', name: 'Pink' },
      { id: 'blue', name: 'Blue' },
      { id: 'green', name: 'Green' },
      { id: 'purple', name: 'Purple' },
      { id: 'silver', name: 'Silver' },
      { id: 'brown', name: 'Brown' },
    ],
  },

  {
    id: 'sizes',
    name: 'Sizes',
    icon: '📐',
    values: [
      { id: 'xs', name: 'XS' },
      { id: 's', name: 'S' },
      { id: 'm', name: 'M' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' },
      { id: 'xxl', name: 'XXL' },
      { id: 'small', name: 'Small' },
      { id: 'medium', name: 'Medium' },
      { id: 'large', name: 'Large' },
      { id: '250ml', name: '250ml' },
      { id: '500ml', name: '500ml' },
      { id: '1l', name: '1L' },
    ],
  },

  {
    id: 'materials',
    name: 'Materials',
    icon: '🧵',
    values: [
      { id: 'cotton', name: 'Cotton' },
      { id: 'leather', name: 'Leather' },
      { id: 'silver-material', name: 'Silver' },
      { id: 'gold-material', name: 'Gold' },
      { id: 'wood', name: 'Wood' },
      { id: 'plastic', name: 'Plastic' },
      { id: 'glass', name: 'Glass' },
      { id: 'silk', name: 'Silk' },
    ],
  },

  {
    id: 'styles',
    name: 'Styles',
    icon: '✨',
    values: [
      { id: 'classic', name: 'Classic' },
      { id: 'modern', name: 'Modern' },
      { id: 'vintage', name: 'Vintage' },
      { id: 'minimalist', name: 'Minimalist' },
      { id: 'luxury', name: 'Luxury' },
    ],
  },

  {
    id: 'gender',
    name: 'Gender',
    icon: '👤',
    values: [
      { id: 'male', name: 'Male' },
      { id: 'female', name: 'Female' },
      { id: 'unisex', name: 'Unisex' },
    ],
  },

  {
    id: 'age-group',
    name: 'Age Group',
    icon: '🎂',
    values: [
      { id: 'kids', name: 'Kids' },
      { id: 'teens', name: 'Teens' },
      { id: 'adults', name: 'Adults' },
    ],
  },
];


export default function ProductModal({ open, onClose, onSave }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [categories, setCategories] = useState<Category[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [showOccasionModal, setShowOccasionModal] = useState(false);
  const [newOccasionName, setNewOccasionName] = useState('');
  const [productTags, setProductTags] = useState<ProductTag[]>([]);
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [newVariantValues, setNewVariantValues] = useState<Record<string, string>>({});
const [showMarketingTagModal, setShowMarketingTagModal] = useState(false);
const [newMarketingTagName, setNewMarketingTagName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
useEffect(() => {
  if (!open) return;

  setForm(INITIAL_FORM);
  setActiveTab('basic');
  setSubCategories([]);
  setVariantGroups(DEFAULT_VARIANTS);

  loadLookups();
}, [open]);

  async function loadLookups() {
    try {
      const [
  categoriesResponse,
  occasionsResponse,
  tagsResponse,
  variantsResponse,
] = await Promise.all([
  api.get('/categories'),
  api.get('/occasions'),
  api.get('/product-tags'),
  api.get('/variant-groups'),
]);

      setCategories(categoriesResponse.data);
      setOccasions(occasionsResponse.data);
      setProductTags(tagsResponse.data);
      setVariantGroups(variantsResponse.data,);
    } catch (error) {
      console.error('Failed to load lookups:', error);
    }
  }

  async function createCategory() {
    if (!newCategoryName.trim()) return;

    try {
      const response = await api.post('/categories', { name: newCategoryName });
      const category = response.data;

      setCategories((prev) =>
        [...prev, category].sort((a, b) => a.name.localeCompare(b.name))
      );

      handleCategoryChange(category.id);
      setShowCategoryModal(false);
      setNewCategoryName('');
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category. Please try again.');
    }
  }

  async function createSubCategory() {
    if (!newSubCategoryName.trim()) return;
    if (!form.categoryId) {
      alert('Please select a category first');
      return;
    }

    try {
      const response = await api.post('/subcategories', {
        categoryId: form.categoryId,
        name: newSubCategoryName,
      });

      const newSub = response.data;

      // Update main categories list
      setCategories((prev) =>
        prev.map((category) =>
          category.id === form.categoryId
            ? {
                ...category,
                subCategories: [...(category.subCategories || []), newSub],
              }
            : category
        )
      );

      // Update current subcategories list
      setSubCategories((prev) => [...prev, newSub]);

      // Auto-select the new subcategory
      setForm((prev) => ({ ...prev, subCategoryId: newSub.id }));

      setShowSubCategoryModal(false);
      setNewSubCategoryName('');
    } catch (error) {
      console.error('Failed to create subcategory:', error);
      alert('Failed to create subcategory. Please try again.');
    }
  }

  async function createOccasion() {
    if (!newOccasionName.trim()) return;

    try {
      const response = await api.post('/occasions', { name: newOccasionName });
      const newOccasion = response.data;

      setOccasions((prev) =>
        [...prev, newOccasion].sort((a, b) => a.name.localeCompare(b.name))
      );

      setForm((prev) => ({
        ...prev,
        occasionIds: [...prev.occasionIds, newOccasion.id],
      }));

      setShowOccasionModal(false);
      setNewOccasionName('');
    } catch (error) {
      console.error('Failed to create occasion:', error);
      alert('Failed to create occasion. Please try again.');
    }
  }

  async function createMarketingTag() {
  if (!newMarketingTagName.trim()) {
    return;
  }

  try {
    const response = await api.post(
      '/product-tags',
      {
        name: newMarketingTagName,
      },
    );

    const newTag = response.data;

    setProductTags((prev) =>
      [...prev, newTag].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    );

    setShowMarketingTagModal(
      false,
    );

    setNewMarketingTagName('');

  } catch (error) {

    console.error(
      'Failed to create marketing tag:',
      error,
    );

    alert(
      'Failed to create marketing tag.',
    );

  }
}

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoryChange(categoryId: string) {
    const selectedCategory = categories.find((c) => c.id === categoryId);
    setSubCategories(selectedCategory?.subCategories || []);
    setForm((prev) => ({ ...prev, categoryId, subCategoryId: '' }));
  }

  function toggleOccasion(occasionId: string) {
    setForm((prev) => ({
      ...prev,
      occasionIds: prev.occasionIds.includes(occasionId)
        ? prev.occasionIds.filter((id) => id !== occasionId)
        : [...prev.occasionIds, occasionId],
    }));
  }

  function toggleProductTag(tagId: string) {
  setForm((prev) => ({
    ...prev,
    productTagIds: prev.productTagIds.includes(tagId)
      ? prev.productTagIds.filter((id) => id !== tagId)
      : [...prev.productTagIds, tagId],
  }));
}

function onToggleVariantSelection(
  groupName: string,
  valueId: string,
) {
  setForm((prev) => {
    const current =
      prev.selectedVariants[groupName] || [];

    const updated = current.includes(valueId)
      ? current.filter((id) => id !== valueId)
      : [...current, valueId];

    return {
      ...prev,

      selectedVariants: {
        ...prev.selectedVariants,
        [groupName]: updated,
      },

      selectedVariantValueIds: Object.values({
        ...prev.selectedVariants,
        [groupName]: updated,
      }).flat(),
    };
  });
}

async function uploadImage(
  file: File,
) {
  const formData = new FormData();

  formData.append(
    'file',
    file,
  );

  const response = await api.post(
    '/uploads/product-image',
    formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    },
  );

  return response.data.url;
}

async function onAddVariantValue(
  groupId: string,
) {
  const name =
    newVariantValues[groupId]?.trim();

  if (!name) return;

  try {
    const response = await api.post(
      '/variant-groups/values',
      {
        variantGroupId: groupId,
        name,
      },
    );

    const newValue = response.data;

    setVariantGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              values: [
                ...group.values,
                newValue,
              ],
            }
          : group,
      ),
    );

    setNewVariantValues((prev) => ({
      ...prev,
      [groupId]: '',
    }));
  } catch (error) {
    console.error(
      'Failed to create variant value:',
      error,
    );
  }
}

  function goToPreviousTab() {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1].id);
    }
  }

  function goToNextTab() {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!form.categoryId) {
      alert('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(form);
      } else {
        // TODO: Implement default save logic here
        console.log('Saving product:', form);
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulate
      }
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) return null;

  const isLastTab = activeTab === 'shipping';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-3xl w-[95vw] max-w-7xl h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-500 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* TAB NAVIGATION */}
          <div className="border-b mb-8">
            <div className="flex overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 whitespace-nowrap font-semibold border-b-4 transition-all ${
                    activeTab === tab.id
                      ? 'border-[#1b7979] text-[#1b7979]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px]">
            {activeTab === 'basic' && (
  <BasicInfoTab
  form={form}
  categories={categories}
  occasions={occasions}
  subCategories={subCategories}
  productTags={productTags}
  onFieldChange={updateField}
  onCategoryChange={handleCategoryChange}
  onToggleOccasion={toggleOccasion}
  onAddCategory={() => setShowCategoryModal(true)}
  onAddSubCategory={() => setShowSubCategoryModal(true)}
  onAddOccasion={() => setShowOccasionModal(true)}
  onAddMarketingTag={() => setShowMarketingTagModal(true)}
  onToggleProductTag={toggleProductTag}
/>
            )}

{activeTab === 'inventory' && (
  <InventoryTab
    form={form}
    onFieldChange={updateField}
  />
)}

{activeTab === 'variants' && (
<VariantTab
  form={form}
  variantGroups={variantGroups}
  newVariantValues={newVariantValues}
  setNewVariantValues={setNewVariantValues}
  onToggleVariantSelection={
    onToggleVariantSelection
  }
  onAddVariantValue={
    onAddVariantValue
  }
  onFieldChange={updateField}
/>
)}

{activeTab === 'pricing' && (
  <PricingTab
    form={form}
    onFieldChange={updateField}
  />
)}

{activeTab === 'media' && (
<MediaTab
  form={form}
  onFieldChange={updateField}
  uploadImage={uploadImage}
/>
)}

{activeTab === 'personalization' && (
  <PersonalizationTab
    form={form}
    onFieldChange={updateField}
  />
)}

{activeTab === 'seo' && (
  <SeoTab
    form={form}
    onFieldChange={updateField}
  />
)}

{activeTab === 'shipping' && (
  <ShippingTab
    form={form}
    onFieldChange={updateField}
  />
)}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-6 flex justify-between items-center">
          <button
            onClick={goToPreviousTab}
            disabled={activeTab === 'basic'}
            className="border px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            ← Previous
          </button>

          {isLastTab ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1b7979] hover:bg-[#145f5f] text-white px-10 py-3 rounded-xl font-semibold transition disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          ) : (
            <button
              onClick={goToNextTab}
              className="bg-[#1b7979] hover:bg-[#145f5f] text-white px-6 py-3 rounded-xl transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* NEW CATEGORY MODAL */}
      {showCategoryModal && (
        <NewItemModal
          title="Add Category"
          name={newCategoryName}
          onNameChange={setNewCategoryName}
          onCancel={() => {
            setShowCategoryModal(false);
            setNewCategoryName('');
          }}
          onSave={createCategory}
        />
      )}

      {/* NEW SUBCATEGORY MODAL */}
      {showSubCategoryModal && (
        <NewItemModal
          title="Add Subcategory"
          name={newSubCategoryName}
          onNameChange={setNewSubCategoryName}
          onCancel={() => {
            setShowSubCategoryModal(false);
            setNewSubCategoryName('');
          }}
          onSave={createSubCategory}
        />
      )}

      {/* NEW OCCASION MODAL */}
      {showOccasionModal && (
        <NewItemModal
          title="Add Occasion"
          name={newOccasionName}
          onNameChange={setNewOccasionName}
          onCancel={() => {
            setShowOccasionModal(false);
            setNewOccasionName('');
          }}
          onSave={createOccasion}
        />
      )}

{showMarketingTagModal && (
  <NewMarketingTagModal
    name={newMarketingTagName}
    onNameChange={setNewMarketingTagName}
    onCancel={() => {
      setShowMarketingTagModal(false);
      setNewMarketingTagName('');
    }}
    onSave={createMarketingTag}
  />
)}

    </div>
  );
}

/* Reusable Modal */
type NewItemModalProps = {
  title: string;
  name: string;
  onNameChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

function NewItemModal({ title, name, onNameChange, onCancel, onSave }: NewItemModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">{title}</h3>

        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter name"
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:border-[#1b7979] text-lg"
          autoFocus
        />

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onCancel}
            className="px-6 py-3 border rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-[#1b7979] text-white px-8 py-3 rounded-xl hover:bg-[#145f5f] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

type NewMarketingTagModalProps = {
  name: string;
  onNameChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

function NewMarketingTagModal({
  name,
  onNameChange,
  onCancel,
  onSave,
}: NewMarketingTagModalProps) {
  return (
    <div className="
      fixed inset-0
      bg-black/40
      flex items-center justify-center
      z-[60]
    ">
      <div className="
        bg-white
        rounded-2xl
        p-6
        w-[500px]
      ">
        <h3 className="
          text-xl font-bold mb-4
        ">
          Add Marketing Tag
        </h3>

        <input
          value={name}
          onChange={(e) =>
            onNameChange(e.target.value)
          }
          placeholder="Marketing Tag Name"
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

        <div className="
          flex justify-end gap-3
          mt-6
        ">
          <button
            onClick={onCancel}
            className="
              border
              px-4 py-2
              rounded-xl
            "
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="
              bg-[#1b7979]
              text-white
              px-4 py-2
              rounded-xl
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

type PricingTabProps = {
  form: ProductForm;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
};

type InventoryTabProps = {
  form: ProductForm;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
};

type VariantTabProps = {
  form: ProductForm;

  variantGroups: VariantGroup[];

  newVariantValues: Record<string, string>;

  setNewVariantValues: React.Dispatch<
    React.SetStateAction<
      Record<string, string>
    >
  >;

  onToggleVariantSelection: (
    groupName: string,
    valueId: string,
  ) => void;

  onAddVariantValue: (
    groupId: string,
  ) => void;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
};

type MediaTabProps = {
  form: ProductForm;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;

  uploadImage: (
    file: File,
  ) => Promise<string>;
};

type PersonalizationTabProps = {
  form: ProductForm;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
};

type SeoTabProps = {
  form: ProductForm;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
};

type ShippingTabProps = {
  form: ProductForm;

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
};


/* Basic Info Tab */
type BasicInfoTabProps = {
  form: ProductForm;
  categories: Category[];
  occasions: Occasion[];
  subCategories: SubCategory[];
  productTags: ProductTag[];

  onFieldChange: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;

  onCategoryChange: (categoryId: string) => void;
  onToggleOccasion: (occasionId: string) => void;

  onAddCategory: () => void;
  onAddSubCategory: () => void;
  onAddOccasion: () => void;
  onAddMarketingTag: () => void;
  onToggleProductTag: (tagId: string) => void;
};

function BasicInfoTab({
  form,
  categories,
  occasions,
  subCategories,
  productTags,
  onAddMarketingTag,
  onFieldChange,
  onCategoryChange,
  onToggleOccasion,
  onAddCategory,
  onAddSubCategory,
  onAddOccasion,
  onToggleProductTag
}: BasicInfoTabProps) {
  return (
    <div className="space-y-10">
      {/* IDENTITY */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Product Identity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
              placeholder="Luxury Gift Hamper"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">SKU</label>
            <input
              value={form.sku}
              onChange={(e) => onFieldChange('sku', e.target.value)}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
              placeholder="SKU-000001"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => onFieldChange('slug', e.target.value)}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
              placeholder="luxury-gift-hamper"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Brand</label>
            <input
              value={form.brand}
              onChange={(e) => onFieldChange('brand', e.target.value)}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
              placeholder="Rexus Premium"
            />
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Description</h2>
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
          placeholder="Detailed product description..."
        />
      </div>

      {/* CLASSIFICATION */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Classification</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Category *</label>
              <button
                type="button"
                onClick={onAddCategory}
                className="text-sm text-[#1b7979] font-semibold hover:underline"
              >
                + New Category
              </button>
            </div>
            <select
              value={form.categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Sub Category</label>
              <button
                type="button"
                onClick={onAddSubCategory}
                className="text-sm text-[#1b7979] font-semibold hover:underline"
                disabled={!form.categoryId}
              >
                + New Subcategory
              </button>
            </div>
            <select
              value={form.subCategoryId}
              onChange={(e) => onFieldChange('subCategoryId', e.target.value)}
              disabled={subCategories.length === 0}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979] disabled:opacity-50"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              value={form.isActive ? 'active' : 'inactive'}
              onChange={(e) => onFieldChange('isActive', e.target.value === 'active')}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Tags</label>
            <input
              value={form.tags}
              onChange={(e) => onFieldChange('tags', e.target.value)}
              className="w-full border rounded-xl p-4 focus:outline-none focus:border-[#1b7979]"
              placeholder="Luxury, Birthday, Flowers"
            />
          </div>
        </div>
      </div>

      {/* OCCASIONS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Occasions</h2>
          <button
            type="button"
            onClick={onAddOccasion}
            className="text-sm text-[#1b7979] font-semibold hover:underline"
          >
            + New Occasion
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {occasions.map((occasion) => (
            <label
              key={occasion.id}
              className="flex items-center gap-3 border rounded-2xl px-5 py-3 cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                checked={form.occasionIds.includes(occasion.id)}
                onChange={() => onToggleOccasion(occasion.id)}
                className="w-5 h-5 accent-[#1b7979]"
              />
              <span>{occasion.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* VISIBILITY & MARKETING */}
      <div>
        <div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    Marketing
  </h2>

  <button
    type="button"
    onClick={onAddMarketingTag}
    className="
      text-sm
      text-[#1b7979]
      font-semibold
    "
  >
    + New Marketing Tag
  </button>

</div>
<div className="grid md:grid-cols-2 gap-4">
  {productTags.map((tag) => (
    <label
      key={tag.id}
      className="
        flex items-center gap-3
        cursor-pointer
      "
    >
      <input
        type="checkbox"
        checked={form.productTagIds.includes(
          tag.id,
        )}
        onChange={() =>
          onToggleProductTag(tag.id)
        }
        className="
          w-5 h-5
          accent-[#1b7979]
        "
      />

      <span>{tag.name}</span>
    </label>
  ))}
</div>
      </div>
    </div>
  );
}

function PricingTab({
  form,
  onFieldChange,
}: PricingTabProps) {
  const effectiveSellingPrice =
  form.discountPrice &&
  form.discountPrice > 0
    ? form.price - form.discountPrice
    : form.price;

const taxAmount =
  effectiveSellingPrice *
  (form.tax / 100);

const netRevenue =
  effectiveSellingPrice -
  taxAmount;

const profit =
  netRevenue -
  form.buyingPrice;

const margin =
  netRevenue > 0
    ? (
        (profit / netRevenue) *
        100
      ).toFixed(2)
    : '0';
  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Pricing
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium">
              Buying Price
            </label>

            <input
              type="number"
              value={form.buyingPrice || ''}
              onChange={(e) =>
  onFieldChange(
    'buyingPrice',
    e.target.value === ''
      ? 0
      : Number(e.target.value),
  )
}
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Selling Price
            </label>

            <input
              type="number"
              value={form.price || ''}
              onChange={(e) =>
                onFieldChange(
                  'price',
                      e.target.value === ''
      ? 0
                  :Number(e.target.value),
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Discount Price
            </label>

            <input
              type="number"
              value={form.discountPrice ?? ''}
              onChange={(e) =>
                onFieldChange(
                  'discountPrice',
                  e.target.value
                    ? Number(e.target.value)
                    : null,
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Tax %
            </label>

            <input
              type="number"
              value={form.tax || ''}
              onChange={(e) =>
                onFieldChange(
                  'tax',
                      e.target.value === ''
      ? 0
                  :Number(e.target.value),
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border">
        <h3 className="font-bold text-lg mb-4">
          Profit Analysis
        </h3>

        <div className="space-y-2">

          <p>
            Profit:
            <strong>
              {' '}
              KES {profit.toLocaleString()}
            </strong>
          </p>

          <p>
            Margin:
            <strong>
              {' '}
              {margin}%
            </strong>
          </p>

        </div>
      </div>

    </div>
  );
}

function InventoryTab({
  form,
  onFieldChange,
}: InventoryTabProps) {
  const availableStock =
    form.stock - form.reservedStock;

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Inventory
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium">
              Current Stock
            </label>

            <input
              type="number"
              value={form.stock || ''}
              onChange={(e) =>
                onFieldChange(
                  'stock',
                  Number(e.target.value || 0),
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Reserved Stock
            </label>

            <input
              type="number"
              value={form.reservedStock || ''}
              onChange={(e) =>
                onFieldChange(
                  'reservedStock',
                  Number(e.target.value || 0),
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Low Stock Alert
            </label>

            <input
              type="number"
              value={form.lowStockAlert || ''}
              onChange={(e) =>
                onFieldChange(
                  'lowStockAlert',
                  Number(e.target.value || 0),
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">
          Inventory Summary
        </h3>

        <div className="space-y-2">

          <p>
            Available Stock:
            <strong>
              {' '}
              {availableStock}
            </strong>
          </p>

          <p>
            Low Stock Threshold:
            <strong>
              {' '}
              {form.lowStockAlert}
            </strong>
          </p>

        </div>
      </div>

      <div className="space-y-4">

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.trackInventory}
            onChange={(e) =>
              onFieldChange(
                'trackInventory',
                e.target.checked,
              )
            }
            className="w-5 h-5"
          />

          Track Inventory
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.allowBackOrders}
            onChange={(e) =>
              onFieldChange(
                'allowBackOrders',
                e.target.checked,
              )
            }
            className="w-5 h-5"
          />

          Allow Back Orders
        </label>

      </div>

    </div>
  );
}

function VariantTab({
  form,
  variantGroups,
  newVariantValues,
  setNewVariantValues,
  onToggleVariantSelection,
  onAddVariantValue,
}: VariantTabProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {variantGroups.map((group) => (
        <div
          key={group.id}
          className="
            bg-white
            border
            rounded-2xl
            p-6
          "
        >
          <h3
            className="
              text-lg
              font-bold
              mb-4
            "
          >
            {group.name}
          </h3>

          <div className="flex flex-wrap gap-3 mb-4">
            {group.values.map((value) => {
              const selected =
                (
                  form.selectedVariants?.[
                    group.name
                  ] || []
                ).includes(value.id);

              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() =>
                    onToggleVariantSelection(
                      group.name,
                      value.id,
                    )
                  }
                  className={`
                    px-4 py-2
                    rounded-full
                    border
                    transition

                    ${
                      selected
                        ? 'bg-[#1b7979] text-white border-[#1b7979]'
                        : 'bg-white text-gray-700'
                    }
                  `}
                >
                  {value.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              value={
                newVariantValues[group.id] || ''
              }
              onChange={(e) =>
                setNewVariantValues((prev) => ({
                  ...prev,
                  [group.id]: e.target.value,
                }))
              }
              placeholder={`Add ${group.name}`}
              className="
                flex-1
                border
                rounded-xl
                p-3
                focus:outline-none
                focus:border-[#1b7979]
              "
            />

            <button
              type="button"
              onClick={() =>
                onAddVariantValue(group.id)
              }
              className="
                px-5 py-3
                rounded-full
                border
                font-medium
                hover:bg-gray-50
                transition
                whitespace-nowrap
              "
            >
              + Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaTab({
  form,
  onFieldChange,
  uploadImage,
}: MediaTabProps) {
  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Product Media
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium">
              Thumbnail Image URL
            </label>

            <div>
  <label className="block mb-2 font-medium">
    Product Thumbnail
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const imageUrl =
        await uploadImage(file);

      onFieldChange(
        'thumbnail',
        imageUrl,
      );
    }}
    className="w-full border rounded-xl p-4"
  />

 {form.thumbnail && (
  <div
    className="
      mt-6
      border
      rounded-2xl
      p-4
      bg-white
      w-fit
    "
  >
    <img
      src={`http://localhost:3001${form.thumbnail}`}
      alt="Thumbnail"
      className="
        w-64
        h-64
        object-cover
        rounded-xl
      "
    />

    <button
      type="button"
      onClick={() =>
        onFieldChange(
          'thumbnail',
          '',
        )
      }
      className="
        mt-3
        w-full
        bg-red-500
        text-white
        py-2
        rounded-xl
      "
    >
      Remove Image
    </button>
  </div>
)}
</div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Product Video URL
            </label>

            <input
              value={form.videoUrl}
              onChange={(e) =>
                onFieldChange(
                  'videoUrl',
                  e.target.value,
                )
              }
              className="w-full border rounded-xl p-4"
              placeholder="https://youtube.com/..."
            />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-bold text-lg mb-4">
          Gallery Images
        </h3>

        <textarea
          rows={6}
          value={(form.images || []).join('\n')}
          onChange={(e) =>
            onFieldChange(
              'images',
              e.target.value
                .split('\n')
                .filter(Boolean),
            )
          }
          className="w-full border rounded-xl p-4"
          placeholder={`One image URL per line

https://...
https://...
https://...`}
        />
      </div>

    </div>
  );
}

function PersonalizationTab({
  form,
  onFieldChange,
}: PersonalizationTabProps) {
  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Personalization Settings
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.allowGiftMessage}
              onChange={(e) =>
                onFieldChange(
                  'allowGiftMessage',
                  e.target.checked,
                )
              }
              className="w-5 h-5"
            />
            <span>
              Allow Gift Message
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.allowCustomText}
              onChange={(e) =>
                onFieldChange(
                  'allowCustomText',
                  e.target.checked,
                )
              }
              className="w-5 h-5"
            />
            <span>
              Allow Custom Text
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.allowPhotoUpload}
              onChange={(e) =>
                onFieldChange(
                  'allowPhotoUpload',
                  e.target.checked,
                )
              }
              className="w-5 h-5"
            />
            <span>
              Allow Photo Upload
            </span>
          </label>

        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Maximum Message Length
          </label>

<input
  type="number"
  value={
    form.maxMessageLength === 0
      ? ''
      : form.maxMessageLength
  }
  onChange={(e) =>
    onFieldChange(
      'maxMessageLength',
      e.target.value === ''
        ? 0
        : Number(e.target.value),
    )
  }
  className="border rounded-xl p-4"
/>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Personalization Charge (KES)
          </label>

         <input
  type="number"
  value={
    form.personalizationCharge === 0
      ? ''
      : form.personalizationCharge
  }
  onChange={(e) =>
    onFieldChange(
      'personalizationCharge',
      e.target.value === ''
        ? 0
        : Number(e.target.value),
    )
  }
  className="w-full border rounded-xl p-4"
/>
        </div>

      </div>

    </div>
  );
}

function SeoTab({
  form,
  onFieldChange,
}: SeoTabProps) {
  const previewTitle =
  form.metaTitle.trim() || form.name;

const previewSlug =
  form.slug.trim() ||
  form.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const previewDescription =
  form.metaDescription.trim() ||
  form.description ||
  'No description available.';

  return (
    <div className="space-y-8">

      {/* SEO Fields */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Search Engine Optimization
        </h2>

        <div className="space-y-6">

          {/* Meta Title */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium">
                Meta Title
              </label>

              <span
                className={`text-sm ${
                  form.metaTitle.length > 60
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {form.metaTitle.length}/60
              </span>
            </div>

            <input
              value={form.metaTitle}
              onChange={(e) =>
                onFieldChange(
                  'metaTitle',
                  e.target.value,
                )
              }
              className="w-full border rounded-xl p-4"
              placeholder="Leave blank to use Product Name"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium">
                Meta Description
              </label>

              <span
                className={`text-sm ${
                  form.metaDescription.length > 160
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {form.metaDescription.length}/160
              </span>
            </div>

            <textarea
              rows={4}
              value={form.metaDescription}
              onChange={(e) =>
                onFieldChange(
                  'metaDescription',
                  e.target.value,
                )
              }
              className="w-full border rounded-xl p-4"
              placeholder="Leave blank to use Product Description"
            />
          </div>

        </div>
      </div>

      {/* Google Preview */}
     <div className="border rounded-2xl bg-white p-6">

  <h3 className="font-bold mb-5">
    Google Search Preview
  </h3>

  <div className="space-y-1">

    <div className="text-blue-700 text-xl font-medium hover:underline cursor-pointer">
      {previewTitle}
      {' | '}
      Rexus Gift Shop
    </div>

    <div className="text-green-700 text-sm">
      rexusgifts.com
      {' › '}
      products
      {' › '}
      {previewSlug}
    </div>

    <div className="text-gray-600 text-sm leading-6 max-w-2xl">
      {previewDescription}
    </div>

  </div>

</div>
    </div>
  );
}

function ShippingTab({
  form,
  onFieldChange,
}: ShippingTabProps) {
  return (
    <div className="space-y-10">

      {/* Physical Product */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Shipping Settings
        </h2>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isPhysicalProduct}
            onChange={(e) =>
              onFieldChange(
                'isPhysicalProduct',
                e.target.checked,
              )
            }
            className="w-5 h-5 accent-[#1b7979]"
          />

          <span>This is a physical product</span>
        </label>
      </div>

      {/* Dimensions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Package Dimensions
        </h3>

        <div className="grid md:grid-cols-4 gap-4">

          <div>
            <label className="block mb-2">
              Weight (kg)
            </label>

            <input
              type="number"
              value={form.weight ?? ''}
              onChange={(e) =>
                onFieldChange(
                  'weight',
                  e.target.value === ''
                    ? null
                    : Number(e.target.value),
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Length (cm)
            </label>

            <input
              type="number"
              value={form.length ?? ''}
              onChange={(e) =>
                onFieldChange(
                  'length',
                  e.target.value === ''
                    ? null
                    : Number(e.target.value),
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Width (cm)
            </label>

            <input
              type="number"
              value={form.width ?? ''}
              onChange={(e) =>
                onFieldChange(
                  'width',
                  e.target.value === ''
                    ? null
                    : Number(e.target.value),
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Height (cm)
            </label>

            <input
              type="number"
              value={form.height ?? ''}
              onChange={(e) =>
                onFieldChange(
                  'height',
                  e.target.value === ''
                    ? null
                    : Number(e.target.value),
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

        </div>
      </div>

      {/* Shipping Options */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Shipping Options
        </h3>

        <div className="space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.freeShipping}
              onChange={(e) =>
                onFieldChange(
                  'freeShipping',
                  e.target.checked,
                )
              }
              className="w-5 h-5 accent-[#1b7979]"
            />
            Free Shipping
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isFragile}
              onChange={(e) =>
                onFieldChange(
                  'isFragile',
                  e.target.checked,
                )
              }
              className="w-5 h-5 accent-[#1b7979]"
            />
            Fragile Item
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.requiresColdStorage}
              onChange={(e) =>
                onFieldChange(
                  'requiresColdStorage',
                  e.target.checked,
                )
              }
              className="w-5 h-5 accent-[#1b7979]"
            />
            Requires Cold Storage
          </label>

        </div>
      </div>

      {/* Packaging */}
      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Packaging Type
          </label>

          <input
            value={form.packagingType}
            onChange={(e) =>
              onFieldChange(
                'packagingType',
                e.target.value,
              )
            }
            placeholder="Premium Gift Box"
            className="w-full border rounded-xl p-4"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Estimated Delivery
          </label>

          <select
            value={form.estimatedDelivery}
            onChange={(e) =>
              onFieldChange(
                'estimatedDelivery',
                e.target.value,
              )
            }
            className="w-full border rounded-xl p-4"
          >
            <option value="">
              Select Delivery Time
            </option>

            <option>
              Same Day
            </option>

            <option>
              Next Day
            </option>

            <option>
              2–3 Days
            </option>

            <option>
              5–7 Days
            </option>

          </select>
        </div>

      </div>

    </div>
  );
}