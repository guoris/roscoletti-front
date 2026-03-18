import { reactive, ref } from "vue";

export const storage = reactive({
  navbar: {
    compact: false,
  },
});

export const referralCode = ref(null);

export const updateStorage = () => {
  localStorage.setItem('preferences', JSON.stringify(storage));
};

export const getStorage = () => {
  const data = localStorage.getItem('preferences');
  const code = sessionStorage.getItem('referral_code');
  if (data) Object.assign(storage, JSON.parse(data));
  if (code) referralCode.value = code;
};

getStorage();