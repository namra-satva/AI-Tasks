import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Input,
  DatePicker,
  Select,
  Switch,
  Card,
  Tabs,
  Table,
  Form,
} from "antd";
import dayjs from "dayjs"; // Ant Design DatePicker works well with dayjs
import {
  X,
  History,
  Settings,
  HelpCircle,
  Files,
  Image,
  Type,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { Upload, message } from "antd";
import { UploadCloud } from "lucide-react";
import axios from "axios";
const { Header, Content, Sider, Footer } = Layout;
const { TextArea } = Input;

function UploadPage() {
  const [selectedTab, setSelectedTab] = useState("edit");
  const [fileList, setFileList] = useState([]);

  const handleFileChange = ({ file, fileList }) => {
    if (file.status !== "uploading") {
      const isSupportedFormat = [
        "application/pdf",
        "image/png",
        "image/jpeg",
      ].includes(file.type);
      const isSizeValid = file.size / 1024 / 1024 < 5; // 5MB limit

      if (!isSupportedFormat) {
        message.error("Only PDF, PNG, and JPEG formats are supported.");
        return;
      }
      if (!isSizeValid) {
        message.error("File size should be less than 5MB.");
        return;
      }

      setFileList(fileList);
      uploadFile(file);
    }
  };

  const [invoiceData, setInvoiceData] = useState({
    company: {
      name: "",
      address: "",
      email: "",
      phone: "",
    },
    products: [],
    total: null,
    Subtotal: null,
    tax: null,
    invoiceNumber: null,
    invoiceDate: null,
    dueDate: null,
  });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data) {
        setInvoiceData({
          company: {
            name: response.data.extracted_text.Name_Client || "",
            address: response.data.companyAddress || "",
            email: response.data.companyEmail || "",
            phone: response.data.companyPhone || "",
          },
          products: response.data.extracted_text.Products,
          total: response.data.extracted_text.total,
          Subtotal: response.data.extracted_text.Subtotal,
          tax: response.data.extracted_text.Tax_Precentage,
          invoiceNumber: response.data.extracted_text["invoice number"],
          invoiceDate: response.data.extracted_text["invoice date"],
          dueDate: response.data.extracted_text.Due_Date || null,
        });
        console.log(response.data.extracted_text.Products);
        console.log(response.data);

        message.success("File uploaded successfully");
      } else {
        message.error("Invalid response from server");
      }
    } catch (error) {
      console.error("File upload failed", error);
      message.error("File upload failed");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "number",
      width: 70,
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Product/service",
      dataIndex: "product",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 200,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      width: 100,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      width: 80,
      render: () => (
        <div className="flex justify-center">
          <input type="checkbox" className="rounded border-gray-300" />
        </div>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      number: "1",
      product: "",
      description: "",
      qty: "",
      rate: "",
      amount: "",
      tax: false,
    },
  ];

  return (
    <div>
      <h2>Upload Invoice</h2>
      <Layout className="min-h-screen">
        <Layout>
          <Content className="p-6">
            <div className="bg-white rounded-lg min-h-[calc(100vh-120px)]">
              <div className="border-b">
                <Tabs
                  activeKey={selectedTab}
                  onChange={setSelectedTab}
                  items={[
                    { key: "edit", label: "Edit" },
                    { key: "email", label: "Email view" },
                    { key: "payor", label: "Payor view" },
                    { key: "pdf", label: "PDF view" },
                  ]}
                />
              </div>

              <div className="grid h-full">
                <div className="border-r">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">⚡</span>
                        <span className="font-medium">
                          Autofill this invoice with
                        </span>
                        <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">
                          BETA
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                          <Button
                            className="flex items-center gap-2 border-gray-300 bg-gray-50"
                            icon={<Files className="w-4 h-4" />}
                          >
                            Files
                          </Button>
                          <Button
                            className="flex items-center gap-2 border-gray-300"
                            icon={<Image className="w-4 h-4" />}
                          >
                            Images
                          </Button>
                          <Button
                            className="flex items-center gap-2 border-gray-300"
                            icon={<Type className="w-4 h-4" />}
                          >
                            Text
                          </Button>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            type="text"
                            icon={<ChevronLeft className="w-5 h-5" />}
                          />
                          <Button
                            type="text"
                            icon={<ChevronRight className="w-5 h-5" />}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Layout>
                        <Content className="p-6">
                          <div className="bg-white rounded-lg min-h-[calc(100vh-120px)] p-6">
                            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 bg-blue-50 text-center">
                              <Upload.Dragger
                                fileList={fileList}
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                                multiple
                                className="w-full"
                              >
                                <Button
                                  type="primary"
                                  className="bg-green-600 mb-4 mx-auto"
                                >
                                  + Upload Files
                                </Button>
                                <p className="text-gray-600">
                                  or drag and drop here
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Supported formats: PDF, PNG, JPEG (Max: 5MB)
                                </p>
                              </Upload.Dragger>
                            </div>
                          </div>
                        </Content>
                      </Layout>

                      <div className="p-4 bg-white border rounded-lg">
                        <div className="flex justify-between mb-8">
                          <div>
                            <h1 className="text-3xl text-blue-600 font-bold mb-4">
                              INVOICE
                            </h1>
                            <div className="space-y-1">
                              <div>Test Company</div>
                              <div>123 Sierra Way</div>
                              <div>San Pablo CA 87999</div>
                              <Button type="link" className="p-0 text-blue-600">
                                Edit company
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-600">
                              namra@satvasolutions.com
                            </div>
                            <div className="text-gray-600">
                              +1 (408) 123-4567
                            </div>
                            <div className="mt-4">
                              <Button type="link" className="text-blue-600">
                                Add logo
                              </Button>
                              <div className="text-gray-400 text-sm">
                                Max size: 1 MB
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Select placeholder="Add customer" className="w-48" />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="mb-2">Terms</div>
                              <Select
                                defaultValue="net30"
                                className="w-full"
                                options={[{ value: "net30", label: "Net 30" }]}
                              />
                            </div>
                            <div>
                              <div className="mb-2">Invoice date</div>
                              <DatePicker
                                value={
                                  invoiceData?.invoiceDate
                                    ? dayjs(
                                        invoiceData.invoiceDate,
                                        "DD/MM/YYYY"
                                      )
                                    : null
                                }
                                className="w-full"
                              />
                            </div>
                            <div>
                              <div className="mb-2">Due date</div>
                              <DatePicker
                                value={
                                  invoiceData?.dueDate
                                    ? dayjs(invoiceData.dueDate, "DD/MM/YYYY")
                                    : null
                                }
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="mt-8">
                            <Input
                              placeholder="Start typing to add a tag"
                              prefix={
                                <span className="text-gray-400">
                                  Tags (hidden):
                                </span>
                              }
                              suffix={
                                <Button type="link" className="text-blue-600">
                                  Manage tags
                                </Button>
                              }
                            />
                          </div>
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-medium mb-4">
                            Product or service
                          </h2>
                          <Table
                            columns={columns}
                            dataSource={invoiceData.products.map(
                              (item, index) => ({
                                key: index,
                                number: index + 1,
                                product: item.description || "",
                                description: item.description || "",
                                qty: item.qty || "",
                                rate: item.unit_price || "",
                                amount: item.amount || "",
                                tax: item.tax || false,
                              })
                            )}
                            pagination={false}
                            className="mb-4"
                          />
                          <div className="flex gap-2">
                            <Button className="flex items-center gap-2">
                              Add product or service
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button>Clear all lines</Button>
                          </div>

                          <div className="mt-8 grid grid-cols-2 gap-8">
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium">
                                  Customer payment options
                                </h3>
                                <Button
                                  type="link"
                                  className="text-blue-600 p-0"
                                >
                                  Edit
                                </Button>
                              </div>
                              <div className="flex gap-2 mb-4">
                                <img
                                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                                  alt="Apple Pay"
                                  className="h-8"
                                />
                                <img
                                  src="https://www.mastercard.us/content/dam/public/mastercardcom/na/us/en/homepage/Home/mc-logo-52.svg"
                                  alt="Visa"
                                  className="h-8"
                                />
                                <img
                                  src="https://www.visa.com/images/merchantoffers/card-image.png"
                                  alt="Mastercard"
                                  className="h-8"
                                />
                                <img
                                  src="https://www.paypalobjects.com/webstatic/mktg/logo/bank_logo.svg"
                                  alt="Bank"
                                  className="h-8"
                                />
                              </div>
                              <TextArea
                                rows={4}
                                placeholder="Tell your customer how you want to get paid."
                                className="mb-4"
                              />
                              <h3 className="font-medium mb-2">
                                Note to customer
                              </h3>
                              <TextArea
                                rows={4}
                                placeholder="Thank you for your business and have a great day!"
                              />
                              <div className="mt-4">
                                <h3 className="font-medium mb-2">
                                  Internal customer notes (hidden)
                                </h3>
                                <TextArea rows={4} />
                              </div>
                            </div>

                            <div>
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>{invoiceData.Subtotal || "$0.00"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Discount</span>
                                  <div className="flex gap-2">
                                    <Button size="small">%</Button>
                                    <Button size="small">$</Button>
                                    <span>$0.00</span>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span>Taxable subtotal</span>
                                  <span>$0.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span>Sales tax</span>
                                    <Info className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      placeholder="Select tax rate"
                                      className="w-48"
                                    />
                                    <span>{invoiceData.tax || "$0.00"}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                  <span className="font-medium">
                                    Invoice total
                                  </span>
                                  <span className="font-medium">
                                    {invoiceData.total || "$0.00"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button>Print or download</Button>
              <div className="flex gap-2">
                <Button>Save</Button>
                <Button type="primary" className="bg-green-600">
                  Review and send
                </Button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default UploadPage;
