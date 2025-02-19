<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import _ from "lodash";
import { NForm, NFormItem, NButton, NModal, NSelect, NCard, NImage, NSkeleton } from "naive-ui";
import gamedataApi from "@/api/gamedata";
import { getOperatorAvatar, getSkillImage } from "@/utils/game_image";

type Strategies = "ToTheEnd" | "AfterFirstLevel" | "AfterMoney";

interface RogueConfiguration {
  strategy: Strategies;
  operators: Array<string>;
}

const strategyOptions: Array<{
  label: string;
  value: Strategies;
}> = [
    {
      label: "尽可能往后打",
      value: "ToTheEnd",
    },
    {
      label: "刷源石锭投资，第一层商店后退出",
      value: "AfterFirstLevel",
    },
    {
      label: "刷源石锭投资，投资后退出",
      value: "AfterMoney",
    },
  ];

const props = defineProps<{
  configurations: RogueConfiguration;
}>();

const showModal = ref(false);

const operators: Ref<unknown[]> = ref([]);
const skills: Ref<unknown> = ref();

onMounted(async () => {
  operators.value = Object.values(await gamedataApi.getAllOperators() as Object);
  skills.value = await gamedataApi.getAllSkills();
  operators.value.forEach(async operator => {
    operator.image = await getOperatorAvatar(operator.name);
  });
});

</script>

<template>
  <NForm
    class="configuration-form rogue-configuration"
    size="small"
    :show-feedback="false"
    :label-align="'left'"
    :label-placement="'top'"
    :label-width="'150px'"
  >
    <NFormItem label="通关策略">
      <NSelect
        :value="props.configurations.strategy"
        :options="strategyOptions"
        @update:value="
          (value) => _.set(props.configurations, 'strategy', value)
        "
      />
    </NFormItem>
    <NFormItem :show-label="false">
      <NButton
        quaternary
        type="primary"
        @click="showModal = true"
        :focusable="false"
      >干员招募顺序...</NButton>
    </NFormItem>
    <NModal
      v-model:show="showModal"
      title="干员招募顺序"
      display-directive="show"
      role="dialog"
      aria-modal="true"
    >
      <NCard
        style="width: 600px"
        role="dialog"
        aria-modal="true"
        title="干员招募顺序"
      >
        <div v-for="operator in operators" :key="operator.name">
          <span>{{ operator.name }}</span>
          <img :src="operator.image" />
        </div>
      </NCard>
    </NModal>
  </NForm>
</template>

<style lang="less" scoped></style>
