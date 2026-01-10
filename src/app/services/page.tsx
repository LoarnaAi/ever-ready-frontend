export default function Services() {
  return (
    <div className="bg-byteloop-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-byteloop-green">Our Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-[#007BFF] bg-clip-text text-transparent sm:text-4xl">
            AI Solutions for Every Business Need
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We offer a comprehensive suite of AI automation services designed to transform your business operations.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="flex flex-col rounded-2xl bg-white/5 p-6 hover:bg-white/10 transition-all">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  {service.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{service.description}</p>
                  <p className="mt-6">
                    <a href="/contact" className="text-sm font-semibold leading-6 text-byteloop-green hover:text-opacity-80 transition-all">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    name: 'Process Automation',
    description: 'Automate repetitive tasks and workflows with AI-powered solutions that learn and adapt to your business processes.',
  },
  {
    name: 'Custom AI Development',
    description: 'Get tailored AI solutions built specifically for your business needs, from chatbots to predictive analytics.',
  },
  {
    name: 'Integration Services',
    description: 'Seamlessly integrate AI solutions with your existing systems and workflows for maximum efficiency.',
  },
  {
    name: 'AI Consultation',
    description: 'Get expert guidance on implementing AI in your business with our strategic consulting services.',
  },
  {
    name: 'Maintenance & Support',
    description: 'Ensure your AI solutions continue to perform optimally with our ongoing maintenance and support services.',
  },
  {
    name: 'Document Intelligence',
    description: 'Transform unstructured documents into actionable data with our advanced document processing and analysis solutions.',
  },
]
