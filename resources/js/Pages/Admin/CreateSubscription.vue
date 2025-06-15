<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <form @submit.prevent="submit" class="space-y-6">
        <div class="bg-white shadow sm:rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Create New Subscription</h2>
          
          <!-- New User Information -->
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <!-- Subscription Details -->
          <div class="mt-6 space-y-4">
            <div>
              <label for="plan_name" class="block text-sm font-medium text-gray-700">Plan</label>
              <select
                id="plan_name"
                v-model="form.plan_name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            <div>
              <label for="period" class="block text-sm font-medium text-gray-700">Period</label>
              <select
                id="period"
                v-model="form.period"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="start_date"
                v-model="form.start_date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="end_date"
                v-model="form.end_date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                v-model="form.price"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label for="original_price" class="block text-sm font-medium text-gray-700">Original Price</label>
              <input
                type="number"
                id="original_price"
                v-model="form.original_price"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div class="mt-6">
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="processing"
            >
              Create Subscription
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useForm } from '@inertiajs/vue3'

export default {
  setup() {
    const form = useForm({
      name: '',
      email: '',
      plan_name: 'Basic',
      period: 'monthly',
      start_date: '',
      end_date: '',
      price: '',
      original_price: '',
    })

    const submit = () => {
      form.post(route('admin.subscriptions.store'), {
        onSuccess: () => {
          form.reset()
        },
      })
    }

    return {
      form,
      submit,
      processing: form.processing,
    }
  },
}
</script> 