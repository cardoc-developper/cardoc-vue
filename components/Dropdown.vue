<template>
    <div ref="dropdown" class="relative w-full">
        <button @click="toggleDropdown"
            class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent flex justify-between items-center">

            <!-- Affichage de l'option sélectionnée avec une pastille si nécessaire -->
            <span class="flex items-center gap-2">
                <!-- Pastille de couleur si l'option sélectionnée a un hex -->
                <div v-if="selectedOptionHex" class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: selectedOptionHex }"></div>
                <span>{{ selectedOptionLabel || placeholder }}</span>
            </span>

            <span class="ml-2">&#9662;</span>
        </button>

        <ul v-if="isOpen" class="absolute w-full mt-2 border border-gray-300 bg-[#18181b] rounded-lg z-10">
            <li v-for="(option, index) in options" :key="index" @click="selectOption(option)"
                class="py-2 px-4 hover:bg-gray-100 hover:text-black cursor-pointer bg-transparent transition-all"
                :class="{ 'flex items-center gap-2': option.hex }">
                <div v-if="option.hex" class="w-4 h-4 rounded-full mr-2 border border-black"
                    :style="{ backgroundColor: option.hex }"></div>
                {{ optionLabel(option) }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

// Props pour le v-model et autres options
const props = defineProps({
    modelValue: { // Correspond au v-model
        type: String,
        default: null
    },
    options: {
        type: Array,
        required: true,
    },
    placeholder: {
        type: String,
        default: "Choisissez une option",
    },
    optionLabelKey: {
        type: String,
        default: null, // Si null, utilisez l'option elle-même
    },
});

const emit = defineEmits(["update:modelValue", "option-selected"]);

const isOpen = ref(false);
const selectedOption = ref<string | null>(null);
const selectedOptionHex = ref<string | null>(null);
const selectedOptionLabel = ref<string | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = (option: any) => {
    selectedOption.value = option.value;
    selectedOptionHex.value = option.hex || null;
    selectedOptionLabel.value = optionLabel(option);
    emit("update:modelValue", option.value);
    emit("option-selected", option);
    isOpen.value = false;
};

const optionLabel = (option: any) => {
    return props.optionLabelKey ? option[props.optionLabelKey] : option.value.charAt(0).toUpperCase() + option.value.slice(1) || option;
};

// Fonction pour fermer le dropdown si on clique à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    // Si modelValue est non nul, cherche l'option correspondante
    if (props.modelValue) {
        const foundOption = props.options.find(option => option.value === props.modelValue);
        if (foundOption) {
            selectedOption.value = foundOption.value;
            selectedOptionHex.value = foundOption.hex || null;
            selectedOptionLabel.value = optionLabel(foundOption);
        }
    }

    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>
