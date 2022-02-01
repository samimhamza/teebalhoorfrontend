<template>
  <div class="">
    <p class="mb-1 custom-input-title" v-if="label">{{ $tr(label) }}</p>
    <v-select
      :class="`custom-input ${small ? 'small' : ''} ${
        rounded ? 'cr-rounded' : ''
      }`"
      :items="items"
      dense
      :no-data-text="$tr('no_data_available')"
      :placeholder="$tr(placeholder ? placeholder : label)"
      :menu-props="{ bottom: true, offsetY: true }"
      outlined
      v-bind="$attrs"
      v-on="$listeners"
      v-if="type == 'select'"
    >
      <template v-slot:[`item`]="{ item }" v-if="country">
        <v-list-item-content>
          <div class="d-flex align-center">
            <div class="me-1">
              <FlagIcon :flag="item.iso2.toLowerCase()" round />
            </div>
            <div>
              <v-list-item-title v-html="`${item.name}`"></v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>

      <template v-slot:[`item`]="{ item }" v-else-if="hasLogo">
        <v-list-item-content>
          <div class="d-flex align-center">
            <div class="me-1">
              <v-avatar size="30">
                <img :src="item.logo" alt="" />
              </v-avatar>
            </div>
            <div>
              <v-list-item-title v-html="`${item.name}`"></v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>

      <template v-slot:[`item`]="{ item }" v-else-if="user">
        <v-list-item-content>
          <div class="d-flex align-center">
            <div class="me-1">
              <v-avatar size="30">
                <img :src="item.image" alt="" />
              </v-avatar>
            </div>
            <div>
              <v-list-item-title
                v-html="`${item.firstname} ${item.lastname} (${item.code})`"
              ></v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>
    </v-select>
    <v-autocomplete
      :class="`custom-input auto-complete ${small ? 'small' : ''} ${
        rounded ? 'cr-rounded' : ''
      }`"
      autocomplete="no"
      :items="items"
      dense
      :no-data-text="$tr('no_data_available')"
      :placeholder="$tr(placeholder ? placeholder : label)"
      :menu-props="{ bottom: true, offsetY: true }"
      outlined
      @keypress="onKeyPressed"
      v-bind="$attrs"
      v-on="$listeners"
      v-if="type === 'autocomplete'"
    >
      <template v-slot:[`selection`]="{ item }" v-if="language">
        <div class="d-flex align-center">
          <div class="me-1">
            <FlagIcon small :flag="item.iso2.toLowerCase()" round />
          </div>
          <div>
            {{ `${item.language_name} (${item.country_name})` }}
          </div>
        </div>
      </template>
      <template v-slot:[`item`]="{ item }" v-if="currency">
        <div class="d-flex align-center">
          <div class="me-1">
            <FlagIcon small :flag="item.symbol.toLowerCase()" round />
          </div>
          <div>
            {{ `${item.name}` }}
          </div>
        </div>
      </template>
      <template v-slot:[`item`]="{ item }" v-else-if="country">
        <v-list-item-content>
          <div class="d-flex align-center">
            <div class="me-1">
              <FlagIcon :flag="item.iso2.toLowerCase()" round />
            </div>
            <div>
              <v-list-item-title v-html="`${item.name}`"></v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>

      <template v-slot:[`item`]="{ item }" v-else-if="language">
        <v-list-item-content>
          <div class="d-flex align-center">
            <div class="me-1">
              <FlagIcon :flag="item.iso2.toLowerCase()" round />
            </div>
            <div>
              <v-list-item-title
                v-html="`${item.language_native} (${item.country_name})`"
              ></v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>

      <template v-slot:[`item`]="{ item }" v-else-if="hasLogo">
        <v-list-item-content>
          <div class="d-flex align-center">
            <div class="me-1">
              <v-avatar v-if="logoName" :size="30" color="blue-grey darken-3">
                <span class="white--text text-h6 pa-1">
                  {{ item[logoName] ? item[logoName][0].toUpperCase() : "" }}
                </span>
              </v-avatar>

              <v-avatar v-else size="30">
                <img :src="item.logo" alt="" />
              </v-avatar>
            </div>
            <div>
              <v-list-item-title
                class="text-capitalize"
                v-html="`${item.name}`"
              ></v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-text-field
      :class="`custom-input ${small ? 'small' : ''} ${
        rounded ? 'cr-rounded' : ''
      }`"
      dense
      :placeholder="$tr(placeholder ? placeholder : label)"
      :menu-props="{ bottom: true, offsetY: true }"
      outlined
      v-if="type == 'textfield'"
      v-bind="$attrs"
      v-on="$listeners"
      :dir="rtl ? 'rtl' : 'ltr'"
    >
    </v-text-field>
    <v-text-field
      :class="`custom-input ${small ? 'small' : ''} ${
        rounded ? 'cr-rounded' : ''
      }`"
      dense
      :placeholder="$tr(placeholder ? placeholder : label)"
      :menu-props="{ bottom: true, offsetY: true }"
      outlined
      v-if="type == 'number'"
      v-bind="$attrs"
      v-on="$listeners"
      type="number"
      :dir="rtl ? 'rtl' : 'ltr'"
    >
    </v-text-field>
    <v-text-field
      :class="`custom-input ${small ? 'small' : ''} ${
        rounded ? 'cr-rounded' : ''
      }`"
      dense
      :type="show1 ? 'text' : 'password'"
      :placeholder="$tr(placeholder ? placeholder : label)"
      :menu-props="{ bottom: true, offsetY: true }"
      outlined
      v-bind="$attrs"
      v-on="$listeners"
      v-if="type == 'password'"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show1 = !show1"
    >
    </v-text-field>
    <v-menu
      v-if="type == 'date-picker'"
      v-model="datepicker"
      transition="scale-transition"
      offset-y
      min-width="auto"
      :close-on-content-click="true"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :class="`custom-input ${small ? 'small' : ''} ${
            rounded ? 'cr-rounded' : ''
          }`"
          v-model="date"
          :placeholder="$tr(placeholder ? placeholder : label)"
          v-bind="attrs"
          v-on="on"
          dense
          readonly
          outlined
          :hide-details="hideDetails"
        ></v-text-field>
      </template>
      <v-date-picker
        no-title
        v-model.trim="date"
        @input="
          () => {
            datepicker = false;
            $emit('getDate', date);
          }
        "
      >
      </v-date-picker>
    </v-menu>
    <v-menu
      ref="menu"
      v-if="type === 'time-picker'"
      v-model="menu2"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="300px"
      :return-value.sync="time"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :class="`custom-input ${small ? 'small' : ''} ${
            rounded ? 'cr-rounded' : ''
          }`"
          v-model="time"
          :placeholder="$tr(placeholder ? placeholder : label)"
          v-bind="attrs"
          v-on="on"
          dense
          readonly
          outlined
          :hide-details="hideDetails"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="menu2"
        v-model="time"
        full-width
        @click:minute="
          () => {
            $refs.menu.save(time);
            $emit('getTime', time);
          }
        "
      ></v-time-picker>
    </v-menu>

    <v-textarea
      outlined
      :class="`custom-input ${small ? 'small' : ''} ${
        rounded ? 'cr-rounded' : ''
      }`"
      :placeholder="$tr(placeholder ? placeholder : label)"
      v-bind="$attrs"
      v-on="$listeners"
      v-if="type == 'textarea'"
      dense
    ></v-textarea>
  </div>
</template>
<script>
// import TimeRangePicker from "vuetify-time-range-picker";
import FlagIcon from "../../common/FlagIcon.vue";

export default {
  components: {
    FlagIcon,
    // TimeRangePicker,
  },
  props: {
    country: {
      type: Boolean,
      default: false,
    },
    language: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: Boolean,
      default: false,
    },

    hasLogo: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
    },
    small: {
      type: Boolean,
    },
    rounded: {
      type: Boolean,
    },
    rangeDate: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
    },
    dateValue: {
      default: "",
    },
    timeValue: {
      default: "",
    },

    logoName: {
      type: String,
      default: "name",
    },
    rtl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show1: false,
      datepicker: false,
      date: this.dateValue,
      time: this.timeValue,
      menu2: false,
      timerange: { start: "00:00", end: "23:59" },
    };
  },
  methods: {
    onKeyPressed(event) {
      if (event.keyCode === 13) {
        return;
      }
    },
    setDateTime(date, time) {
      this.date = date;
      this.time = time;
    },
  },
};
</script>
<style>
.custom-input .v-input__slot {
  border-radius: 4px !important;
}

.custom-input.small .v-input__slot {
  min-height: 20px !important;
  height: 26px;
  padding: 0 10px;
}

.v-input__slot fieldset {
  /* border: 0 !important; */
  border: 2px solid var(--input-border-color);
}

.custom-input .v-input__slot .v-select__selections {
  padding: 0 !important;
}

.custom-input .v-input__append-inner {
  margin-top: 6px !important;
}

.custom-input .v-select__selection--comma {
  margin: 2px 4px 3px 0;
}

.custom-input ::placeholder {
  color: var(--input-placeholder-color) !important;
  font-size: 16px;
  letter-spacing: 1px;
}

.custom-input input,
.custom-input textarea {
  font-size: 16px;
  letter-spacing: 1px;
}

.custom-input-title {
  font-size: 16px;
  color: var(--input-title-color);
  letter-spacing: 1px;
}

.custom-input .v-text-field__details {
  margin-bottom: 4px !important;
}

.custom-input.small .v-input__prepend-inner,
.custom-input.small .v-input__append-inner {
  margin-top: 2px !important;
  font-size: 10px;
}

.custom-input.small input,
.custom-input ::placeholder {
  font-size: 14px !important;
}

.custom-input.cr-rounded .v-input__slot fieldset {
  border-radius: 20px;
}
</style>
