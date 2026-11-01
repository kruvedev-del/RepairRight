export interface Product {
  id: string;
  name: string;
  tagline: string;
  isConcept: boolean;
  statusBadge: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
  stockStatus?: string;
  deliveryInfo?: string;
  orderProcessingMethod?: string;
  summary: string;
  details: string[];
  specs?: Record<string, string>;
  imageRef?: string;
  accentColor: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'tankguard-mini',
    name: 'TankGuard Mini',
    tagline: 'Monitor. Be Aware.',
    isConcept: true,
    statusBadge: 'Concept Product — In Lab Validation',
    summary: 'A compact moisture and acoustic overflow detector designed to sit unobtrusively near washing machines or water heaters.',
    details: [
      'Concept design featuring moisture detection contacts and dual acoustic monitoring.',
      'Designed to signal abnormal pooling water or unusual continuous pump running.',
      'Not commercially certified or available for order. Displayed as an active R&D hardware prototype from the RepairRight presentation showcase.'
    ],
    specs: {
      'Status': 'Engineering concept / Lab validation',
      'Power': 'Coin-cell CR2450 (Concept spec)',
      'Connectivity': 'Bluetooth LE / Local buzzer',
      'Dimensions': '52mm × 52mm × 18mm',
      'Order Status': 'Not available for purchase'
    },
    imageRef: '/assets/aistudio/RepairRight_Brand_Presentation_Board_ca06c351.png',
    accentColor: '#70C8F4',
  },
  {
    id: 'sound-sensor-prototype',
    name: 'Appliance Sound-Sensor',
    tagline: 'Acoustic pattern logger for technician reference.',
    isConcept: true,
    statusBadge: 'Prototype Concept — Diagnostic Performance Not Validated',
    summary: 'An acoustic vibration monitor designed to attach magnetically to appliance cabinets and record cycle frequency signatures for professional review.',
    details: [
      'Diagnostic performance is not validated: sound alone cannot confirm an internal fault.',
      'Intended to collect reference audio for qualified technicians rather than provide automated DIY diagnoses.',
      'Prototype shown on RepairRight presentation boards. Not for commercial sale.'
    ],
    specs: {
      'Status': 'Prototype concept — not validated',
      'Mounting': 'Magnetic chassis clip (Concept)',
      'Acoustic Range': '20 Hz – 12 kHz MEMS microphone',
      'Order Status': 'Not available for purchase'
    },
    imageRef: '/assets/aistudio/RepairRight_Brand_Presentation_Board_ca06c351.png',
    accentColor: '#FFD331',
  },
  {
    id: 'isolation-pads-4pack',
    name: 'RepairRight Vibration Isolation Pads',
    tagline: 'High-density anti-walk dampers (Set of 4).',
    isConcept: false,
    statusBadge: 'Available in Demo Store',
    price: 18.50,
    currency: 'USD',
    inStock: true,
    stockStatus: 'In Stock (Demo stock verified)',
    deliveryInfo: 'Demo shipping: 3–5 business days (Simulated delivery)',
    orderProcessingMethod: 'Demo checkout — no charge or real transaction',
    summary: 'Heavy-duty vulcanized rubber dampers engineered to stabilize washing machine feet and reduce acoustic floor vibration during high-speed spin cycles.',
    details: [
      'Non-invasive physical mitigation for washing machines that rock or vibrate excessively on tile or wood floors.',
      'Reinforced recessed cup fits standard adjustable washer feet up to 1.8 inches diameter.',
      'Helps prevent floor scratching and secondary rattling during spin cycles.'
    ],
    specs: {
      'Material': 'High-density vulcanized polymer',
      'Pack Size': '4 isolation dampening pads',
      'Weight Capacity': 'Up to 600 lbs total appliance weight',
      'Installation': 'Slip under existing feet — no disassembly required'
    },
    accentColor: '#171635',
  },
  {
    id: 'technician-share-card-pack',
    name: 'RepairRight Appliance Diagnostic Pocket Cards',
    tagline: 'Waterproof symptom checklist & model log sheets.',
    isConcept: false,
    statusBadge: 'Available in Demo Store',
    price: 8.00,
    currency: 'USD',
    inStock: true,
    stockStatus: 'In Stock (Demo stock verified)',
    deliveryInfo: 'Demo shipping: 2–4 business days (Simulated delivery)',
    orderProcessingMethod: 'Demo checkout — no charge or real transaction',
    summary: 'Laminated wipe-clean reference cards with standard serial plate locations, error code templates, and safety cutoff points for your appliance cupboard.',
    details: [
      'Keep your appliance model, serial number, and technician service notes right by the machine.',
      'Includes quick-reference QR code to open RepairRight safe check anytime.',
      'Water-resistant matte synthetic cardstock.'
    ],
    specs: {
      'Format': '3× Double-sided laminated reference cards + dry-erase marker',
      'Compatibility': 'Universal home appliances'
    },
    accentColor: '#FF4D8D',
  }
];
